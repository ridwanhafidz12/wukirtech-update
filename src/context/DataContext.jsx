import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSupabaseConfig,
  fetchAllRelationalData,
  dbInsertProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbInsertCategory,
  dbUpdateCategory,
  dbRenameProductCategory,
  dbDeleteCategory,
  dbInsertEvent,
  dbUpdateEvent,
  dbDeleteEvent,
  dbUpdateVrTourConfig,
  dbUpsertVrScene,
  dbDeleteVrScene,
  dbClearAllData,
  dbReplaceAllData,
  uploadMediaToCloud,
  subscribeToRelationalChanges,
} from '@/services/supabaseClient';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'wukirtech_products_v2',
  CATEGORIES: 'wukirtech_categories_v2',
  EVENTS: 'wukirtech_events_v2',
  NEWS: 'wukirtech_news_v1',
  VR_TOUR: 'wukirtech_vrtour_v1',
};

const EMPTY_VR_TOUR = {
  title: 'VR Tour 360° Desa Wisata Wukirsari',
  subtitle: 'Jelajah virtual interaktif cagar budaya dan alam Wukirsari, Imogiri',
  theme: 'Cultural Heritage & Nature',
  startSceneId: '',
  scenes: [],
};

const readLocalSafe = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

export const DataProvider = ({ children }) => {
  const isCloudConfigured = getSupabaseConfig().isConfigured;

  const [products, setProducts] = useState(() =>
    isCloudConfigured ? [] : readLocalSafe(STORAGE_KEYS.PRODUCTS, [])
  );
  const [categories, setCategories] = useState(() =>
    isCloudConfigured ? [] : readLocalSafe(STORAGE_KEYS.CATEGORIES, [])
  );
  const [events, setEvents] = useState(() =>
    isCloudConfigured ? [] : readLocalSafe(STORAGE_KEYS.EVENTS, [])
  );
  const [news, setNews] = useState(() =>
    isCloudConfigured ? [] : readLocalSafe(STORAGE_KEYS.NEWS, [])
  );
  const [vrTour, setVrTour] = useState(() =>
    isCloudConfigured ? EMPTY_VR_TOUR : readLocalSafe(STORAGE_KEYS.VR_TOUR, EMPTY_VR_TOUR)
  );
  const [isLoading, setIsLoading] = useState(isCloudConfigured);

  const loadFromSupabase = useCallback(async () => {
    if (!getSupabaseConfig().isConfigured) {
      setIsLoading(false);
      return;
    }
    const res = await fetchAllRelationalData();
    if (res.ok && res.data) {
      setCategories(res.data.categories || []);
      setProducts(res.data.products || []);
      setEvents(res.data.events || []);
      setNews(res.data.news || []);
      setVrTour(res.data.vrTour || EMPTY_VR_TOUR);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadFromSupabase();
    const unsubscribe = subscribeToRelationalChanges(() => {
      loadFromSupabase();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadFromSupabase]);

  // Cache lokal hanya jika mode offline/non-Supabase agar tidak membebani kuota saat memakai Supabase
  useEffect(() => {
    if (isCloudConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products, isCloudConfigured]);

  useEffect(() => {
    if (isCloudConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories, isCloudConfigured]);

  useEffect(() => {
    if (isCloudConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }, [events, isCloudConfigured]);

  useEffect(() => {
    if (isCloudConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.error('Error saving news:', e);
    }
  }, [news, isCloudConfigured]);

  useEffect(() => {
    if (isCloudConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VR_TOUR, JSON.stringify(vrTour));
    } catch (e) {
      console.error('Error saving vrTour:', e);
    }
  }, [vrTour, isCloudConfigured]);

  // Product CRUD
  const addProduct = (productData) => {
    const rawImages = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images.filter(Boolean)
      : (productData.imageUrl ? [productData.imageUrl] : ['/batik.jpg']);

    const primaryImg = rawImages[0] || productData.imageUrl || '/batik.jpg';
    const priceNum = Number(productData.priceNum) || parseInt((productData.price || '').replace(/[^0-9]/g, ''), 10) || 0;
    const price = productData.price || (priceNum > 0 ? `Rp${priceNum.toLocaleString('id-ID')}` : 'Hubungi Penjual');

    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      price,
      priceNum,
      imageUrl: primaryImg,
      images: rawImages,
      qrisImage: productData.qrisImage || '',
      fullDescription: productData.fullDescription || productData.description || '',
      highlights: Array.isArray(productData.highlights) ? productData.highlights : [],
      specifications: Array.isArray(productData.specifications) ? productData.specifications : [],
      stockStatus: productData.stockStatus || 'Tersedia',
      rating: productData.rating || 4.9,
    };
    setProducts((prev) => [newProduct, ...prev]);
    dbInsertProduct(newProduct);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    let updatedProductObj = null;
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
            qrisImage: updatedFields.qrisImage !== undefined ? updatedFields.qrisImage : (p.qrisImage || ''),
            fullDescription: updatedFields.fullDescription !== undefined ? updatedFields.fullDescription : (p.fullDescription || p.description || ''),
            highlights: updatedFields.highlights !== undefined ? updatedFields.highlights : p.highlights,
            specifications: updatedFields.specifications !== undefined ? updatedFields.specifications : p.specifications,
          };
          if (updatedFields.priceNum !== undefined) {
            updated.priceNum = Number(updatedFields.priceNum) || 0;
            if (!updatedFields.price && updated.priceNum > 0) {
              updated.price = `Rp${updated.priceNum.toLocaleString('id-ID')}`;
            }
          } else if (updatedFields.price && !updatedFields.priceNum) {
            updated.priceNum = parseInt(String(updatedFields.price).replace(/[^0-9]/g, ''), 10) || 0;
          }
          updatedProductObj = updated;
          return updated;
        }
        return p;
      })
    );
    if (updatedProductObj) {
      dbUpdateProduct(updatedProductObj);
    }
  };

  const getProductById = (id) => {
    if (!id) return null;
    return products.find((p) => p.id === id || String(p.id) === String(id)) || null;
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    dbDeleteProduct(id);
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
    dbInsertCategory(newCategory);
    return newCategory;
  };

  const updateCategory = (id, updatedFields) => {
    const target = categories.find((c) => c.id === id);
    const oldName = target ? target.name : null;
    let updatedCat = null;

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updatedCat = { ...c, ...updatedFields };
          return updatedCat;
        }
        return c;
      })
    );

    if (updatedCat) {
      dbUpdateCategory(updatedCat);
    }

    if (oldName && updatedFields.name && oldName !== updatedFields.name) {
      setProducts((prev) =>
        prev.map((p) =>
          p.category === oldName ? { ...p, category: updatedFields.name } : p
        )
      );
      dbRenameProductCategory(oldName, updatedFields.name);
    }
  };

  const deleteCategory = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
    dbDeleteCategory(id);

    setProducts((prev) =>
      prev.map((p) =>
        p.category === target.name ? { ...p, category: 'Lainnya' } : p
      )
    );
    dbRenameProductCategory(target.name, 'Lainnya');
  };

  // Event / Agenda CRUD
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`,
      status: eventData.status || 'Akan Datang',
    };
    setEvents((prev) => [newEvent, ...prev]);
    dbInsertEvent(newEvent);
    return newEvent;
  };

  const updateEvent = (id, updatedFields) => {
    let updatedEvt = null;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          updatedEvt = { ...e, ...updatedFields };
          return updatedEvt;
        }
        return e;
      })
    );
    if (updatedEvt) {
      dbUpdateEvent(updatedEvt);
    }
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    dbDeleteEvent(id);
  };

  // VR Tour CRUD
  const updateVrTourConfig = (fields) => {
    setVrTour((prev) => {
      const next = { ...prev, ...fields };
      dbUpdateVrTourConfig(next);
      return next;
    });
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
    setVrTour((prev) => {
      const nextStartId = prev.startSceneId || newScene.id;
      const nextScenes = [...prev.scenes, newScene];
      const next = { ...prev, startSceneId: nextStartId, scenes: nextScenes };
      dbUpsertVrScene(newScene, nextScenes.length - 1);
      if (!prev.startSceneId) dbUpdateVrTourConfig(next);
      return next;
    });
    return newScene;
  };

  const updateVrScene = (sceneId, updatedFields) => {
    setVrTour((prev) => {
      let updatedSceneObj = null;
      let sceneIdx = 0;
      const nextScenes = prev.scenes.map((s, idx) => {
        if (s.id === sceneId) {
          updatedSceneObj = { ...s, ...updatedFields };
          sceneIdx = idx;
          return updatedSceneObj;
        }
        return s;
      });
      if (updatedSceneObj) dbUpsertVrScene(updatedSceneObj, sceneIdx);
      return { ...prev, scenes: nextScenes };
    });
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
      const next = { ...prev, startSceneId: nextStartId, scenes: remaining };
      dbDeleteVrScene(sceneId);
      remaining.forEach((s, idx) => dbUpsertVrScene(s, idx));
      if (nextStartId !== prev.startSceneId) dbUpdateVrTourConfig(next);
      return next;
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
      scenes: prev.scenes.map((scene, idx) => {
        if (scene.id !== sceneId) return scene;
        const currentHotspots = scene.hotspots || [];
        const exists = currentHotspots.some((h) => h.id === normalizedId);
        const updatedScene = {
          ...scene,
          hotspots: exists
            ? currentHotspots.map((h) => (h.id === normalizedId ? nextHotspot : h))
            : [...currentHotspots, nextHotspot],
        };
        dbUpsertVrScene(updatedScene, idx);
        return updatedScene;
      }),
    }));

    return nextHotspot;
  };

  const deleteVrHotspot = (sceneId, hotspotId) => {
    setVrTour((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene, idx) => {
        if (scene.id !== sceneId) return scene;
        const updatedScene = {
          ...scene,
          hotspots: (scene.hotspots || []).filter((h) => h.id !== hotspotId),
        };
        dbUpsertVrScene(updatedScene, idx);
        return updatedScene;
      }),
    }));
  };

  // Clear All & Backup
  const resetToDefaults = async () => {
    setProducts([]);
    setCategories([]);
    setEvents([]);
    setNews([]);
    setVrTour(EMPTY_VR_TOUR);
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error(e);
    }
    await dbClearAllData();
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        version: '3.0',
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
      const nextCategories = Array.isArray(data.categories) ? data.categories : categories;
      const nextProducts = Array.isArray(data.products) ? data.products : products;
      const nextEvents = Array.isArray(data.events) ? data.events : events;
      const nextNews = Array.isArray(data.news) ? data.news : news;
      const nextVrTour = data.vrTour && Array.isArray(data.vrTour.scenes) ? data.vrTour : vrTour;

      setCategories(nextCategories);
      setProducts(nextProducts);
      setEvents(nextEvents);
      setNews(nextNews);
      setVrTour(nextVrTour);

      dbReplaceAllData({
        categories: nextCategories,
        products: nextProducts,
        events: nextEvents,
        news: nextNews,
        vrTour: nextVrTour,
      });
      return true;
    } catch (err) {
      console.error('Invalid JSON import:', err);
      return false;
    }
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
    isLoading,
    isCloudConfigured,
    uploadMedia,
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
