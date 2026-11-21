import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { defaultCategories, defaultProducts, defaultEvents, defaultNews, defaultVrTour } from '@/data/defaultData';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  fetchAppDataFromCloud,
  saveCollectionToCloud,
  syncAllToCloud,
  subscribeToAppDataChanges,
  uploadMediaToCloud,
  getSetupSqlScript,
} from '@/services/supabaseClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'wukirtech_products_v2',
  CATEGORIES: 'wukirtech_categories_v2',
  EVENTS: 'wukirtech_events_v2',
  NEWS: 'wukirtech_news_v1',
  VR_TOUR: 'wukirtech_vrtour_v1',
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!saved) return defaultProducts;
      const parsed = JSON.parse(saved);
      // Jika data tersimpan masih versi lama (< 50 produk), gabungkan dengan defaultProducts baru agar 60 produk tampil lengkap
      const merged = Array.isArray(parsed) && parsed.length >= defaultProducts.length
        ? parsed
        : [
            ...parsed,
            ...defaultProducts.filter((dp) => !parsed.some((p) => p.id === dp.id)),
          ];
      // Normalisasi setiap produk agar selalu memiliki images, fullDescription, dll
      return merged.map((p) => {
        const rawImages = Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.imageUrl ? [p.imageUrl] : ['/batik.jpg']);
        return {
          ...p,
          imageUrl: p.imageUrl || rawImages[0] || '/batik.jpg',
          images: rawImages,
          fullDescription: p.fullDescription || p.description || '',
          highlights: Array.isArray(p.highlights) && p.highlights.length > 0
            ? p.highlights
            : ['Karya Asli Pengrajin Wukirsari', 'Kualitas Terjamin', 'Mendukung Ekonomi Komunitas UMKM'],
          specifications: Array.isArray(p.specifications) && p.specifications.length > 0
            ? p.specifications
            : [
                { label: 'Kategori', value: p.category || 'UMKM Wukirsari' },
                { label: 'Pengrajin', value: p.umkm || 'Pengrajin Lokal Wukirsari' },
                { label: 'Status Stok', value: p.stockStatus || 'Tersedia' },
                { label: 'Asal Wilayah', value: 'Desa Wisata Wukirsari, Imogiri, Bantul' },
              ],
          stockStatus: p.stockStatus || 'Tersedia',
          rating: p.rating || 4.9,
        };
      });
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
      return defaultProducts;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
      return defaultCategories;
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!saved) return defaultEvents;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return defaultEvents;

      // Gabungkan event baru dari defaultEvents & perkaya data lokasi/koordinat/gambar
      const defaultById = new Map(defaultEvents.map((de) => [de.id, de]));
      const enriched = parsed.map((evt) => {
        const def = defaultById.get(evt.id);
        if (def) {
          return {
            ...def,
            ...evt,
            coordinates: evt.coordinates || def.coordinates,
            googleMapsUrl: evt.googleMapsUrl || def.googleMapsUrl,
            venueDetail: evt.venueDetail || def.venueDetail,
            image: evt.image || def.image,
            highlights: Array.isArray(evt.highlights) && evt.highlights.length > 0 ? evt.highlights : def.highlights,
            fullDescription: evt.fullDescription || def.fullDescription,
            dateDisplay: evt.dateDisplay || def.dateDisplay,
            tips: evt.tips || def.tips,
          };
        }
        return {
          ...evt,
          coordinates: evt.coordinates || [-7.9088, 110.4150],
          googleMapsUrl: evt.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.location || 'Desa Wisata Wukirsari Imogiri Bantul')}`,
        };
      });

      const missingDefaults = defaultEvents.filter((de) => !parsed.some((e) => e.id === de.id));
      return [...enriched, ...missingDefaults];
    } catch (e) {
      console.error('Failed to load events from localStorage', e);
      return defaultEvents;
    }
  });

  const [news, setNews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : defaultNews;
    } catch (e) {
      console.error('Failed to load news from localStorage', e);
      return defaultNews;
    }
  });

  const [vrTour, setVrTour] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VR_TOUR);
      if (!saved) return defaultVrTour;
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
        return {
          ...defaultVrTour,
          ...parsed,
          scenes: parsed.scenes,
        };
      }
      return defaultVrTour;
    } catch (e) {
      console.error('Failed to load vrTour from localStorage', e);
      return defaultVrTour;
    }
  });

  // Cloud Sync State
  const [cloudStatus, setCloudStatus] = useState('idle'); // 'idle' | 'checking' | 'connected' | 'syncing' | 'error' | 'unconfigured'
  const [cloudMessage, setCloudMessage] = useState('');
  const [lastCloudSync, setLastCloudSync] = useState(null);
  const [isCloudConfigured, setIsCloudConfigured] = useState(() => getSupabaseConfig().isConfigured);
  const isInitializedRef = useRef(false);
  const ignoreNextSyncRef = useRef({});

  // Inisialisasi koneksi Cloud & listener Realtime
  useEffect(() => {
    let unsubscribe = null;
    const config = getSupabaseConfig();
    setIsCloudConfigured(config.isConfigured);

    if (!config.isConfigured) {
      setCloudStatus('unconfigured');
      setCloudMessage('Penyimpanan lokal aktif. Hubungkan Supabase agar data langsung terupdate ke HP teman dan seluruh internet.');
      isInitializedRef.current = true;
      return;
    }

    setCloudStatus('checking');
    fetchAppDataFromCloud().then((res) => {
      if (res.ok && res.data) {
        if (Array.isArray(res.data.products) && res.data.products.length > 0) {
          ignoreNextSyncRef.current.products = true;
          setProducts(res.data.products);
        }
        if (Array.isArray(res.data.categories) && res.data.categories.length > 0) {
          ignoreNextSyncRef.current.categories = true;
          setCategories(res.data.categories);
        }
        if (Array.isArray(res.data.events) && res.data.events.length > 0) {
          ignoreNextSyncRef.current.events = true;
          setEvents(res.data.events);
        }
        if (Array.isArray(res.data.news) && res.data.news.length > 0) {
          ignoreNextSyncRef.current.news = true;
          setNews(res.data.news);
        }
        if (res.data.vrTour && Array.isArray(res.data.vrTour.scenes) && res.data.vrTour.scenes.length > 0) {
          ignoreNextSyncRef.current.vr_tour = true;
          setVrTour(res.data.vrTour);
        }
        setCloudStatus('connected');
        setCloudMessage('Terhubung ke Supabase Cloud. Data tersinkron online ke seluruh perangkat.');
        setLastCloudSync(new Date().toLocaleTimeString('id-ID'));
      } else {
        setCloudStatus(res.error ? 'error' : 'unconfigured');
        setCloudMessage(res.error || 'Tabel database belum dibuat di Supabase.');
      }
      isInitializedRef.current = true;
    });

    // Realtime channel: ketika admin mengubah data di laptop, HP teman langsung terupdate live
    unsubscribe = subscribeToAppDataChanges((key, data) => {
      if (key === 'products' && Array.isArray(data)) {
        ignoreNextSyncRef.current.products = true;
        setProducts(data);
      } else if (key === 'categories' && Array.isArray(data)) {
        ignoreNextSyncRef.current.categories = true;
        setCategories(data);
      } else if (key === 'events' && Array.isArray(data)) {
        ignoreNextSyncRef.current.events = true;
        setEvents(data);
      } else if (key === 'news' && Array.isArray(data)) {
        ignoreNextSyncRef.current.news = true;
        setNews(data);
      } else if (key === 'vr_tour' && data && Array.isArray(data.scenes)) {
        ignoreNextSyncRef.current.vr_tour = true;
        setVrTour(data);
      }
      setLastCloudSync(new Date().toLocaleTimeString('id-ID'));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isCloudConfigured]);

  // Sync to localStorage & Auto-sync ke Cloud
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
    if (isInitializedRef.current && isCloudConfigured) {
      if (ignoreNextSyncRef.current.products) {
        ignoreNextSyncRef.current.products = false;
      } else {
        saveCollectionToCloud('products', products);
      }
    }
  }, [products, isCloudConfigured]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
    if (isInitializedRef.current && isCloudConfigured) {
      if (ignoreNextSyncRef.current.categories) {
        ignoreNextSyncRef.current.categories = false;
      } else {
        saveCollectionToCloud('categories', categories);
      }
    }
  }, [categories, isCloudConfigured]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events:', e);
    }
    if (isInitializedRef.current && isCloudConfigured) {
      if (ignoreNextSyncRef.current.events) {
        ignoreNextSyncRef.current.events = false;
      } else {
        saveCollectionToCloud('events', events);
      }
    }
  }, [events, isCloudConfigured]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VR_TOUR, JSON.stringify(vrTour));
    } catch (e) {
      console.error('Error saving vrTour (mungkin melebihi kuota localStorage):', e);
    }
    if (isInitializedRef.current && isCloudConfigured) {
      if (ignoreNextSyncRef.current.vr_tour) {
        ignoreNextSyncRef.current.vr_tour = false;
      } else {
        saveCollectionToCloud('vr_tour', vrTour);
      }
    }
  }, [vrTour, isCloudConfigured]);

  // Product CRUD
  const addProduct = (productData) => {
    const rawImages = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images.filter(Boolean)
      : (productData.imageUrl ? [productData.imageUrl] : ['/batik.jpg']);

    const primaryImg = rawImages[0] || productData.imageUrl || '/batik.jpg';

    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      priceNum: Number(productData.priceNum) || parseInt((productData.price || '').replace(/[^0-9]/g, ''), 10) || 0,
      imageUrl: primaryImg,
      images: rawImages,
      fullDescription: productData.fullDescription || productData.description || '',
      highlights: Array.isArray(productData.highlights) ? productData.highlights : [],
      specifications: Array.isArray(productData.specifications) ? productData.specifications : [],
      stockStatus: productData.stockStatus || 'Tersedia',
      rating: productData.rating || 4.9,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const rawImages = Array.isArray(updatedFields.images) && updatedFields.images.length > 0
            ? updatedFields.images.filter(Boolean)
            : (updatedFields.imageUrl ? [updatedFields.imageUrl] : p.images || [p.imageUrl]);

          const primaryImg = updatedFields.imageUrl || rawImages[0] || p.imageUrl;

          const updated = {
            ...p,
            ...updatedFields,
            imageUrl: primaryImg,
            images: rawImages,
            fullDescription: updatedFields.fullDescription !== undefined ? updatedFields.fullDescription : (p.fullDescription || p.description || ''),
            highlights: updatedFields.highlights !== undefined ? updatedFields.highlights : p.highlights,
            specifications: updatedFields.specifications !== undefined ? updatedFields.specifications : p.specifications,
          };
          if (updatedFields.price && !updatedFields.priceNum) {
            updated.priceNum = parseInt(String(updatedFields.price).replace(/[^0-9]/g, ''), 10) || 0;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const getProductById = (id) => {
    if (!id) return null;
    return products.find((p) => p.id === id || String(p.id) === String(id)) || null;
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Category CRUD
  const addCategory = (categoryData) => {
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = {
      ...categoryData,
      id: categoryData.id || `cat-${Date.now()}`,
      slug,
      badgeColor: categoryData.badgeColor || 'bg-primary/10 text-primary border-primary/30',
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updatedFields) => {
    const target = categories.find((c) => c.id === id);
    const oldName = target ? target.name : null;

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    // If category name updated, also cascade update products using that category
    if (oldName && updatedFields.name && oldName !== updatedFields.name) {
      setProducts((prev) =>
        prev.map((p) =>
          p.category === oldName ? { ...p, category: updatedFields.name } : p
        )
      );
    }
  };

  const deleteCategory = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    // Remove category
    setCategories((prev) => prev.filter((c) => c.id !== id));

    // Optional: Reassign affected products to another category or "Lainnya"
    setProducts((prev) =>
      prev.map((p) =>
        p.category === target.name ? { ...p, category: 'Lainnya' } : p
      )
    );
  };

  // Event / Agenda CRUD
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`,
      status: eventData.status || 'Akan Datang',
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id, updatedFields) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // VR Tour CRUD
  const updateVrTourConfig = (fields) => {
    setVrTour((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const addVrScene = (sceneData) => {
    const newScene = {
      id: sceneData.id || `scene-${Date.now()}`,
      name: sceneData.name || 'Ruangan Baru',
      category: sceneData.category || 'Wisata',
      image: sceneData.image || '/images/destinasi/makam-imogiri.jpg',
      description: sceneData.description || '',
      initialYaw: Number(sceneData.initialYaw) || 0,
      initialPitch: Number(sceneData.initialPitch) || 0,
      hotspots: Array.isArray(sceneData.hotspots) ? sceneData.hotspots : [],
    };
    setVrTour((prev) => ({
      ...prev,
      startSceneId: prev.startSceneId || newScene.id,
      scenes: [...prev.scenes, newScene],
    }));
    return newScene;
  };

  const updateVrScene = (sceneId, updatedFields) => {
    setVrTour((prev) => ({
      ...prev,
      scenes: prev.scenes.map((s) =>
        s.id === sceneId ? { ...s, ...updatedFields } : s
      ),
    }));
  };

  const deleteVrScene = (sceneId) => {
    setVrTour((prev) => {
      const remaining = prev.scenes
        .filter((s) => s.id !== sceneId)
        .map((s) => ({
          ...s,
          hotspots: (s.hotspots || []).filter(
            (h) => !(h.type === 'nav' && h.targetSceneId === sceneId)
          ),
        }));
      const nextStartId =
        prev.startSceneId === sceneId
          ? remaining[0]?.id || ''
          : prev.startSceneId;
      return {
        ...prev,
        startSceneId: nextStartId,
        scenes: remaining,
      };
    });
  };

  const saveVrHotspot = (sceneId, hotspotData) => {
    const normalizedId = hotspotData.id || `hs-${Date.now()}`;
    const nextHotspot = {
      ...hotspotData,
      id: normalizedId,
      yaw: Number(hotspotData.yaw) || 0,
      pitch: Number(hotspotData.pitch) || 0,
    };

    setVrTour((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) => {
        if (scene.id !== sceneId) return scene;
        const currentHotspots = scene.hotspots || [];
        const exists = currentHotspots.some((h) => h.id === normalizedId);
        return {
          ...scene,
          hotspots: exists
            ? currentHotspots.map((h) => (h.id === normalizedId ? nextHotspot : h))
            : [...currentHotspots, nextHotspot],
        };
      }),
    }));

    return nextHotspot;
  };

  const deleteVrHotspot = (sceneId, hotspotId) => {
    setVrTour((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              hotspots: (scene.hotspots || []).filter((h) => h.id !== hotspotId),
            }
          : scene
      ),
    }));
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setProducts(defaultProducts);
    setCategories(defaultCategories);
    setEvents(defaultEvents);
    setNews(defaultNews);
    setVrTour(defaultVrTour);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(defaultNews));
      localStorage.setItem(STORAGE_KEYS.VR_TOUR, JSON.stringify(defaultVrTour));
    } catch (e) {
      console.error(e);
    }
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        version: '2.1',
        exportedAt: new Date().toISOString(),
        categories,
        products,
        events,
        news,
        vrTour,
      },
      null,
      2
    );
  };

  const importDataJson = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (Array.isArray(data.news)) setNews(data.news);
      if (data.vrTour && Array.isArray(data.vrTour.scenes)) setVrTour(data.vrTour);
      return true;
    } catch (err) {
      console.error('Invalid JSON import:', err);
      return false;
    }
  };

  // Cloud Sync Actions
  const syncAllToCloudNow = async () => {
    setCloudStatus('syncing');
    setCloudMessage('Sedang mengunggah semua data lokal ke Supabase Cloud...');
    const res = await syncAllToCloud({ products, categories, events, news, vrTour });
    if (res.ok) {
      setCloudStatus('connected');
      setCloudMessage(res.message);
      setLastCloudSync(new Date().toLocaleTimeString('id-ID'));
    } else {
      setCloudStatus('error');
      setCloudMessage(res.message);
    }
    return res;
  };

  const pullFromCloudNow = async () => {
    setCloudStatus('syncing');
    setCloudMessage('Sedang menarik data terbaru dari Supabase Cloud...');
    const res = await fetchAppDataFromCloud();
    if (res.ok && res.data) {
      if (Array.isArray(res.data.products) && res.data.products.length > 0) {
        ignoreNextSyncRef.current.products = true;
        setProducts(res.data.products);
      }
      if (Array.isArray(res.data.categories) && res.data.categories.length > 0) {
        ignoreNextSyncRef.current.categories = true;
        setCategories(res.data.categories);
      }
      if (Array.isArray(res.data.events) && res.data.events.length > 0) {
        ignoreNextSyncRef.current.events = true;
        setEvents(res.data.events);
      }
      if (Array.isArray(res.data.news) && res.data.news.length > 0) {
        ignoreNextSyncRef.current.news = true;
        setNews(res.data.news);
      }
      if (res.data.vrTour && Array.isArray(res.data.vrTour.scenes) && res.data.vrTour.scenes.length > 0) {
        ignoreNextSyncRef.current.vr_tour = true;
        setVrTour(res.data.vrTour);
      }
      setCloudStatus('connected');
      setCloudMessage('Data berhasil diperbarui dari Cloud.');
      setLastCloudSync(new Date().toLocaleTimeString('id-ID'));
      return { ok: true, message: 'Data berhasil disinkronkan dari Cloud.' };
    }
    setCloudStatus('error');
    setCloudMessage(res.error || 'Gagal menarik data dari Cloud.');
    return { ok: false, message: res.error };
  };

  const configureCloudConnection = async ({ url, anonKey }) => {
    setCloudStatus('checking');
    setCloudMessage('Menghubungkan ke Supabase...');
    saveSupabaseConfig({ url, anonKey });
    const isConf = getSupabaseConfig().isConfigured;
    setIsCloudConfigured(isConf);
    const test = await testSupabaseConnection();
    if (test.ok) {
      setCloudStatus('connected');
      setCloudMessage(test.message);
      await pullFromCloudNow();
    } else {
      setCloudStatus(test.tableExists === false ? 'unconfigured' : 'error');
      setCloudMessage(test.message);
    }
    return test;
  };

  const disconnectCloud = () => {
    clearSupabaseConfig();
    setIsCloudConfigured(false);
    setCloudStatus('unconfigured');
    setCloudMessage('Koneksi Supabase diputus. Menggunakan penyimpanan lokal.');
  };

  const uploadMedia = async (file, folder = 'vr-scenes') => {
    return await uploadMediaToCloud(file, folder);
  };

  const value = {
    products,
    categories,
    events,
    news,
    vrTour,
    // Cloud Sync
    cloudStatus,
    cloudMessage,
    lastCloudSync,
    isCloudConfigured,
    syncAllToCloudNow,
    pullFromCloudNow,
    configureCloudConnection,
    disconnectCloud,
    uploadMedia,
    getSetupSqlScript,
    // CRUD
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addEvent,
    updateEvent,
    deleteEvent,
    updateVrTourConfig,
    addVrScene,
    updateVrScene,
    deleteVrScene,
    saveVrHotspot,
    deleteVrHotspot,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
