import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCategories, defaultProducts, defaultEvents, defaultNews, defaultVrTour } from '@/data/defaultData';

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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VR_TOUR, JSON.stringify(vrTour));
    } catch (e) {
      console.error('Error saving vrTour (mungkin melebihi kuota localStorage):', e);
    }
  }, [vrTour]);

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

  const value = {
    products,
    categories,
    events,
    news,
    vrTour,
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
