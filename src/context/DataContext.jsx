import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCategories, defaultProducts, defaultEvents } from '@/data/defaultData';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'wukirtech_products_v1',
  CATEGORIES: 'wukirtech_categories_v1',
  EVENTS: 'wukirtech_events_v1',
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!saved) return defaultProducts;
      const parsed = JSON.parse(saved);
      // Normalisasi setiap produk agar selalu memiliki images, fullDescription, dll
      return parsed.map((p) => {
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
      return saved ? JSON.parse(saved) : defaultEvents;
    } catch (e) {
      console.error('Failed to load events from localStorage', e);
      return defaultEvents;
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

  // Reset & Backup
  const resetToDefaults = () => {
    setProducts(defaultProducts);
    setCategories(defaultCategories);
    setEvents(defaultEvents);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
    } catch (e) {
      console.error(e);
    }
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        categories,
        products,
        events,
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
