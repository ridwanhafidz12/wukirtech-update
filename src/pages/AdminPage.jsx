import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Package,
  FolderTree,
  Calendar,
  Database,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  AlertTriangle,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  Store,
  Tag,
  DollarSign,
  Sparkles,
  Eye,
  Sliders,
  Image as ImageIcon,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PRESET_IMAGES = [
  { label: 'Batik Tulis', url: '/batik.jpg' },
  { label: 'Batik Koleksi 1', url: '/batik-1.jpg' },
  { label: 'Batik Koleksi 2', url: '/batik-2.png' },
  { label: 'Batik Sungsang', url: '/sungsang.jpg' },
  { label: 'Wayang Kulit', url: '/wayang.jpeg' },
  { label: 'Wedang Uwuh', url: '/uwuh.jpg' },
  { label: 'Kipas Bambu', url: '/kipas.jpg' },
  { label: 'Sawah Wukirsari', url: '/sawah.jpg' },
];

const AdminPage = () => {
  const {
    products,
    categories,
    events,
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
  } = useData();

  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | categories | events | backup

  // Product Filter & Form State
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('Semua');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    umkm: '',
    price: '',
    priceNum: 0,
    description: '',
    fullDescription: '',
    imageUrl: '',
    images: [],
    imageAlt: '',
    isNew: false,
    phone: '628816413617',
    stockStatus: 'Tersedia',
    weight: '350 gram',
    highlights: [],
    specifications: [],
  });
  const [newImageInput, setNewImageInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    badgeColor: 'bg-primary/10 text-primary border-primary/30',
  });

  // Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Budaya',
    description: '',
    status: 'Akan Datang',
  });

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'product'|'category'|'event', id, name }

  // JSON Import Textarea
  const [importJsonText, setImportJsonText] = useState('');

  // ---------------- Handlers for Product ----------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setNewImageInput('');
    const defaultHls = ['100% Produk Asli Wukirsari', 'Dibuat Pengrajin Lokal', 'Kualitas Terjamin'];
    setHighlightsInput(defaultHls.join(', '));
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Kuliner',
      umkm: 'UMKM Wukirsari',
      price: 'Rp25.000',
      priceNum: 25000,
      description: '',
      fullDescription: '',
      imageUrl: '/batik.jpg',
      images: ['/batik.jpg'],
      imageAlt: '',
      isNew: true,
      phone: '628816413617',
      stockStatus: 'Tersedia',
      weight: '350 gram',
      highlights: defaultHls,
      specifications: [
        { label: 'Bahan', value: 'Bahan Alami Pilihan' },
        { label: 'Ukuran', value: 'Standar' },
        { label: 'Asal Wilayah', value: 'Desa Wisata Wukirsari, Imogiri' },
      ],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewImageInput('');
    const rawImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : (prod.imageUrl ? [prod.imageUrl] : ['/batik.jpg']);
    const hls = Array.isArray(prod.highlights) ? prod.highlights : [];
    setHighlightsInput(hls.join(', '));
    setProductForm({
      name: prod.name || '',
      category: prod.category || (categories[0]?.name || 'Kuliner'),
      umkm: prod.umkm || '',
      price: prod.price || '',
      priceNum: prod.priceNum || 0,
      description: prod.description || '',
      fullDescription: prod.fullDescription || prod.description || '',
      imageUrl: prod.imageUrl || rawImages[0] || '',
      images: rawImages,
      imageAlt: prod.imageAlt || '',
      isNew: Boolean(prod.isNew),
      phone: prod.phone || '628816413617',
      stockStatus: prod.stockStatus || 'Tersedia',
      weight: prod.weight || '350 gram',
      highlights: hls,
      specifications: Array.isArray(prod.specifications) && prod.specifications.length > 0
        ? prod.specifications
        : [
            { label: 'Bahan', value: 'Material Pilihan' },
            { label: 'Asal Wilayah', value: 'Desa Wukirsari, Imogiri' },
          ],
    });
    setIsProductModalOpen(true);
  };

  const handleAddImageToGallery = (urlToAdd) => {
    const url = (urlToAdd || newImageInput).trim();
    if (!url) return;
    if (productForm.images.includes(url)) {
      toast({
        title: 'Foto Sudah Ada',
        description: 'Foto ini sudah berada di dalam galeri produk.',
      });
      return;
    }
    const updatedImages = [...productForm.images, url];
    setProductForm({
      ...productForm,
      images: updatedImages,
      imageUrl: productForm.imageUrl || url,
    });
    setNewImageInput('');
  };

  const handleRemoveImageFromGallery = (indexToRemove) => {
    if (productForm.images.length <= 1) {
      toast({
        title: 'Minimal 1 Foto',
        description: 'Produk harus memiliki setidaknya satu foto produk.',
        variant: 'destructive',
      });
      return;
    }
    const updatedImages = productForm.images.filter((_, idx) => idx !== indexToRemove);
    setProductForm({
      ...productForm,
      images: updatedImages,
      imageUrl: updatedImages[0] || '',
    });
  };

  const handleSetPrimaryGalleryImage = (indexToSet) => {
    const targetImage = productForm.images[indexToSet];
    if (!targetImage) return;
    const reordered = [targetImage, ...productForm.images.filter((_, idx) => idx !== indexToSet)];
    setProductForm({
      ...productForm,
      images: reordered,
      imageUrl: targetImage,
    });
    toast({
      title: 'Foto Utama Diperbarui ⭐',
      description: 'Gambar ini sekarang menjadi foto sampul / cover produk.',
    });
  };

  const handleAddSpecRow = () => {
    setProductForm({
      ...productForm,
      specifications: [...(productForm.specifications || []), { label: '', value: '' }],
    });
  };

  const handleUpdateSpecRow = (idx, field, val) => {
    const updated = [...(productForm.specifications || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setProductForm({ ...productForm, specifications: updated });
  };

  const handleRemoveSpecRow = (idx) => {
    const updated = (productForm.specifications || []).filter((_, i) => i !== idx);
    setProductForm({ ...productForm, specifications: updated });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Nama produk wajib diisi!',
        variant: 'destructive',
      });
      return;
    }

    const priceNum =
      Number(productForm.priceNum) ||
      parseInt(String(productForm.price).replace(/[^0-9]/g, ''), 10) ||
      0;

    const parsedHighlights = highlightsInput
      ? highlightsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : productForm.highlights || [];

    const finalImages = productForm.images && productForm.images.length > 0
      ? productForm.images
      : [productForm.imageUrl || '/batik.jpg'];

    const payload = {
      ...productForm,
      priceNum,
      images: finalImages,
      imageUrl: finalImages[0] || productForm.imageUrl || '/batik.jpg',
      highlights: parsedHighlights,
      fullDescription: productForm.fullDescription || productForm.description,
      imageAlt: productForm.imageAlt || productForm.name,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast({
        title: 'Produk Diperbarui ✅',
        description: `Produk "${productForm.name}" dan galeri foto berhasil diupdate.`,
      });
    } else {
      addProduct(payload);
      toast({
        title: 'Produk Ditambahkan 🎉',
        description: `Produk "${productForm.name}" berhasil ditambahkan ke katalog WukirTech.`,
      });
    }

    setIsProductModalOpen(false);
  };

  // ---------------- Handlers for Category ----------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      badgeColor: 'bg-primary/10 text-primary border-primary/30',
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      badgeColor: cat.badgeColor || 'bg-primary/10 text-primary border-primary/30',
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Nama kategori wajib diisi!',
        variant: 'destructive',
      });
      return;
    }

    const slug =
      categoryForm.slug.trim() ||
      categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      ...categoryForm,
      slug,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
      toast({
        title: 'Kategori Diperbarui',
        description: `Kategori "${categoryForm.name}" berhasil diupdate.`,
      });
    } else {
      addCategory(payload);
      toast({
        title: 'Kategori Ditambahkan',
        description: `Kategori baru "${categoryForm.name}" berhasil dibuat.`,
      });
    }

    setIsCategoryModalOpen(false);
  };

  // ---------------- Handlers for Event ----------------
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 - Selesai',
      location: 'Desa Wukirsari',
      category: 'Budaya',
      description: '',
      status: 'Akan Datang',
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title || '',
      date: evt.date || '',
      time: evt.time || '',
      location: evt.location || '',
      category: evt.category || 'Budaya',
      description: evt.description || '',
      status: evt.status || 'Akan Datang',
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Judul dan tanggal acara wajib diisi!',
        variant: 'destructive',
      });
      return;
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, eventForm);
      toast({
        title: 'Agenda Diperbarui',
        description: `Agenda "${eventForm.title}" berhasil diupdate.`,
      });
    } else {
      addEvent(eventForm);
      toast({
        title: 'Agenda Ditambahkan',
        description: `Agenda "${eventForm.title}" berhasil dijadwalkan.`,
      });
    }

    setIsEventModalOpen(false);
  };

  // ---------------- Deletion Handling ----------------
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'product') {
      deleteProduct(deleteTarget.id);
      toast({
        title: 'Produk Dihapus',
        description: `Produk "${deleteTarget.name}" telah dihapus dari sistem.`,
      });
    } else if (deleteTarget.type === 'category') {
      deleteCategory(deleteTarget.id);
      toast({
        title: 'Kategori Dihapus',
        description: `Kategori "${deleteTarget.name}" telah dihapus.`,
      });
    } else if (deleteTarget.type === 'event') {
      deleteEvent(deleteTarget.id);
      toast({
        title: 'Agenda Dihapus',
        description: `Agenda "${deleteTarget.name}" telah dihapus.`,
      });
    }

    setDeleteTarget(null);
  };

  // ---------------- Export & Import ----------------
  const handleExportData = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wukirtech-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Cadangan Diunduh',
      description: 'Data JSON berhasil diekspor dan diunduh.',
    });
  };

  const handleImportData = () => {
    if (!importJsonText.trim()) {
      toast({
        title: 'Data Kosong',
        description: 'Tempelkan string JSON yang valid terlebih dahulu.',
        variant: 'destructive',
      });
      return;
    }

    const success = importDataJson(importJsonText);
    if (success) {
      toast({
        title: 'Data Berhasil Dipulihkan',
        description: 'Koleksi produk, kategori, dan agenda telah diperbarui.',
      });
      setImportJsonText('');
    } else {
      toast({
        title: 'Gagal Membaca Data',
        description: 'Format JSON tidak valid atau struktur tidak cocok.',
        variant: 'destructive',
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data default pabrik? Perubahan kustom akan ditimpa.')) {
      resetToDefaults();
      toast({
        title: 'Data Direset',
        description: 'Semua data kembali ke konfigurasi awal bawaan WukirTech.',
      });
    }
  };

  // Filtered Products in Admin Table
  const filteredProducts = products.filter((p) => {
    const matchCat = productCatFilter === 'Semua' || p.category === productCatFilter;
    const q = productSearch.toLowerCase();
    const matchSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.umkm?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Panel Kontrol Admin - WukirTech</title>
        <meta
          name="description"
          content="Admin dashboard WukirTech untuk mengontrol dan mengelola data produk UMKM, sistem kategori, dan agenda kegiatan desa secara serba dinamis."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/15 to-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Top Admin Navigation Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-primary/20 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="text-xs uppercase tracking-widest font-bold text-primary">
                  Administrator Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                Pusat Kendali Dinamis <span className="text-primary">WukirTech</span>
              </h1>

            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <Link to="/cari">
                <Button variant="outline" size="sm" className="h-9 text-xs">
                  <Search className="w-3.5 h-3.5 mr-1.5" /> Halaman Cari
                </Button>
              </Link>
              <Link to="/produk">
                <Button variant="outline" size="sm" className="h-9 text-xs">
                  <Package className="w-3.5 h-3.5 mr-1.5" /> Katalog Produk
                </Button>
              </Link>
              <Link to="/" target="_blank">
                <Button size="sm" className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Lihat Website
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-border/20 scrollbar-thin">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Ringkasan & KPI</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Kelola Produk</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Kelola Kategori</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kelola Agenda</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/70 hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Cadangan & Reset</span>
            </button>
          </div>

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-card/80 border border-border/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Total Produk
                    </span>
                    <span className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Package className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">{products.length}</div>
                </div>

                <div className="bg-card/80 border border-border/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Kategori Aktif
                    </span>
                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <FolderTree className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">{categories.length}</div>
                </div>

                <div className="bg-card/80 border border-border/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Agenda Acara
                    </span>
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Calendar className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">{events.length}</div>
                </div>

                <div className="bg-card/80 border border-border/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Produk Baru
                    </span>
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-300">
                      <Sparkles className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">
                    {products.filter((p) => p.isNew).length}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-card/60 border border-border/30 rounded-2xl p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Aksi Cepat Admin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    onClick={handleOpenAddProduct}
                    className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold justify-start px-4 rounded-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Tambah Produk Baru
                  </Button>
                  <Button
                    onClick={handleOpenAddCategory}
                    variant="outline"
                    className="h-12 border-border/50 hover:bg-secondary font-semibold justify-start px-4 rounded-xl"
                  >
                    <FolderTree className="w-5 h-5 mr-2 text-cyan-400" /> Tambah Kategori Baru
                  </Button>
                  <Button
                    onClick={handleOpenAddEvent}
                    variant="outline"
                    className="h-12 border-border/50 hover:bg-secondary font-semibold justify-start px-4 rounded-xl"
                  >
                    <Calendar className="w-5 h-5 mr-2 text-purple-400" /> Tambah Agenda Acara
                  </Button>
                </div>
              </div>

              {/* Recent Products Overview */}
              <div className="bg-card/80 border border-border/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Produk Terbaru di Katalog</h3>
                  </div>
                  <Button onClick={() => setActiveTab('products')} variant="ghost" size="sm" className="text-xs text-primary">
                    Lihat Semua ({products.length})
                  </Button>
                </div>

                <div className="divide-y divide-border/20">
                  {products.slice(0, 5).map((prod) => (
                    <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.imageUrl?.startsWith('/') || prod.imageUrl?.startsWith('http') ? prod.imageUrl : `/${prod.imageUrl}`}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl bg-secondary/50 flex-shrink-0"
                          onError={(e) => { e.target.src = '/batik.jpg'; }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{prod.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{prod.umkm}</span>
                            <span>•</span>
                            <span className="text-primary font-medium">{prod.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-foreground">{prod.price}</span>
                        <Button
                          onClick={() => handleOpenEditProduct(prod)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: MANAGE PRODUCTS ================= */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Product Controls */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-card/60 border border-border/30 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-xl">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama produk atau UMKM..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 h-10 text-xs bg-background/60"
                    />
                  </div>

                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-input bg-background/60 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleOpenAddProduct}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Produk
                </Button>
              </div>

              {/* Product Table */}
              <div className="bg-card/80 border border-border/30 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-secondary/40 text-muted-foreground uppercase text-[11px] font-semibold tracking-wider border-b border-border/20">
                      <tr>
                        <th className="py-3.5 px-4">Produk</th>
                        <th className="py-3.5 px-4">Kategori</th>
                        <th className="py-3.5 px-4">UMKM</th>
                        <th className="py-3.5 px-4">Harga</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {filteredProducts.map((p) => {
                        const imgSrc = p.imageUrl?.startsWith('/') || p.imageUrl?.startsWith('http')
                          ? p.imageUrl
                          : `/${p.imageUrl}`;
                        return (
                          <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={imgSrc}
                                    alt={p.name}
                                    className="w-12 h-12 object-cover rounded-xl bg-secondary/50 flex-shrink-0"
                                    onError={(e) => { e.target.src = '/batik.jpg'; }}
                                  />
                                  {p.images && p.images.length > 1 && (
                                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-primary text-primary-foreground shadow-sm">
                                      {p.images.length}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground line-clamp-1">{p.name}</span>
                                    {p.stockStatus && p.stockStatus !== 'Tersedia' && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-semibold">
                                        {p.stockStatus}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                                    {p.description || 'Tidak ada deskripsi'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                              {p.umkm}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                              {p.price}
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              {p.isNew ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                  BARU
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">Reguler</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link to={`/produk/${p.id}`} target="_blank">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    title="Lihat Halaman Detail Produk"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() => handleOpenEditProduct(p)}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                                  title="Edit Produk & Galeri"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.name })}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-12 text-muted-foreground">
                            Tidak ada produk ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 3: MANAGE CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-card/60 border border-border/30 rounded-2xl">
                <div>
                  <h3 className="text-base font-bold text-foreground">Sistem Kategori Dinamis</h3>
                  <p className="text-xs text-muted-foreground">
                    Semua kategori di sini otomatis tampil pada filter produk, halaman pencarian, dan formulir input.
                  </p>
                </div>
                <Button
                  onClick={handleOpenAddCategory}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Kategori
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-card/80 border border-border/30 rounded-2xl p-5 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${cat.badgeColor || 'bg-primary/10 text-primary border-primary/20'}`}>
                            {cat.slug || cat.name.toLowerCase()}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {productCount} Produk Terhubung
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-1.5">{cat.name}</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          {cat.description || 'Kategori produk Desa Wukirsari'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                        <Link
                          to={`/cari?cat=${encodeURIComponent(cat.name)}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Lihat di Pencarian <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => handleOpenEditCategory(cat)}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================= TAB 4: MANAGE EVENTS ================= */}
          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-card/60 border border-border/30 rounded-2xl">
                <div>
                  <h3 className="text-base font-bold text-foreground">Agenda & Acara Desa</h3>
                  
                </div>
                <Button
                  onClick={handleOpenAddEvent}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Agenda
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-card/80 border border-border/30 rounded-2xl p-5 hover:border-purple-500/40 shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {evt.category || 'Budaya'}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {evt.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground mb-2">{evt.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                        {evt.description}
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-border/20 mb-3">
                        <div>📅 {evt.date}</div>
                        <div>⏰ {evt.time}</div>
                        <div>📍 {evt.location}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/20 flex items-center justify-end gap-1">
                      <Button
                        onClick={() => handleOpenEditEvent(evt)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget({ type: 'event', id: evt.id, name: evt.title })}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= TAB 5: BACKUP & DATA ================= */}
          {activeTab === 'backup' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
              {/* Export Card */}
              <div className="bg-card/80 border border-border/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Unduh Cadangan Data (Export JSON)</h3>
                    <p className="text-xs text-muted-foreground">
                      Simpan file cadangan lengkap berisi semua data produk, kategori, dan agenda.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  File JSON ini dapat Anda simpan sebagai backup berkala dan dapat dipulihkan kapan saja ke browser mana pun.
                </p>
                <Button onClick={handleExportData} className="bg-primary text-primary-foreground font-semibold text-xs">
                  <Download className="w-4 h-4 mr-1.5" /> Ekspor & Unduh File JSON
                </Button>
              </div>

              {/* Import Card */}
              <div className="bg-card/80 border border-border/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Pulihkan Data (Import JSON)</h3>
                    <p className="text-xs text-muted-foreground">
                      Tempelkan teks JSON atau data hasil ekspor sebelumnya untuk memperbarui seluruh sistem.
                    </p>
                  </div>
                </div>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Tempelkan data JSON di sini (contoh: { 'products': [...], 'categories': [...] })"
                  rows={4}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-input bg-background/70 text-foreground mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button onClick={handleImportData} variant="outline" className="text-xs font-semibold">
                  <Upload className="w-4 h-4 mr-1.5" /> Terapkan & Pulihkan Data
                </Button>
              </div>

              {/* Reset to Defaults Card */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-destructive/20 text-destructive">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-destructive">Kembalikan ke Data Awal Pabrik</h3>
                    <p className="text-xs text-muted-foreground">
                      Hapus semua perubahan lokal dan pulihkan kembali 10 produk dan 5 kategori default Wukirsari.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Tindakan ini akan mengosongkan perubahan lokal yang telah Anda buat di localStorage.
                </p>
                <Button onClick={handleResetData} variant="destructive" size="sm" className="text-xs font-semibold">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Seluruh Data Sekarang
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-3xl bg-card border-border/40 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingProduct ? 'Edit Data Produk & Galeri' : 'Tambah Produk Baru ke Katalog'}
            </DialogTitle>

          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-6 mt-3">
            {/* 1. INFORMASI DASAR PRODUK */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> 1. Informasi Dasar Produk
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Nama Produk *</label>
                  <Input
                    required
                    placeholder="Contoh: Handmade Batik Giriloyo"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Kategori *</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">UMKM / Pembuat *</label>
                  <Input
                    required
                    placeholder="Contoh: Paguyuban Batik Giriloyo"
                    value={productForm.umkm}
                    onChange={(e) => setProductForm({ ...productForm, umkm: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Status Ketersediaan</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none"
                  >
                    <option value="Tersedia">Tersedia (Ready Stock)</option>
                    <option value="Pre-Order">Pre-Order (Pengerjaan Khusus)</option>
                    <option value="Stok Terbatas">Stok Terbatas</option>
                    <option value="Habis">Habis Terjual</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Tampilan Harga (Teks) *</label>
                  <Input
                    required
                    placeholder="Contoh: Rp750.000 atau Rp20.000 / bungkus"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Harga Angka (Untuk Filter & Urutan)
                  </label>
                  <Input
                    type="number"
                    placeholder="750000"
                    value={productForm.priceNum || ''}
                    onChange={(e) => setProductForm({ ...productForm, priceNum: Number(e.target.value) })}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Nomor WhatsApp Penjual</label>
                  <Input
                    placeholder="Contoh: 628816413617"
                    value={productForm.phone}
                    onChange={(e) => setProductForm({ ...productForm, phone: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Perkiraan Berat</label>
                  <Input
                    placeholder="Contoh: 350 gram"
                    value={productForm.weight || ''}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* 2. MANAJEMEN GALERI FOTO (MULTI-IMAGE CRUD) */}
            <div className="space-y-3 pt-3 border-t border-border/20">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> 2. Galeri Foto Produk ({productForm.images?.length || 0} Foto)
                </h4>
                <span className="text-[11px] text-muted-foreground">Foto pertama akan menjadi foto sampul/cover</span>
              </div>

              {/* Input URL Gambar Baru */}
              <div className="flex gap-2">
                <Input
                  placeholder="URL gambar (https://...)"
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageToGallery();
                    }
                  }}
                  className="text-xs h-9 flex-grow"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddImageToGallery()}
                  className="h-9 px-3.5 text-xs bg-primary text-primary-foreground font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Foto
                </Button>
              </div>

              {/* Preset Tombol Cepat */}
              <div className="flex items-center flex-wrap gap-1.5 p-2 rounded-xl bg-secondary/30 border border-border/20">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-primary" /> + Cepat dari Aset Lokal:
                </span>
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => handleAddImageToGallery(img.url)}
                    className="px-2 py-0.5 rounded text-[11px] border border-border/30 bg-card hover:bg-primary/20 hover:text-primary transition-all text-muted-foreground"
                    title={`Tambahkan ${img.label} ke galeri`}
                  >
                    + {img.label}
                  </button>
                ))}
              </div>

              {/* Grid Daftar Foto di Galeri */}
              {productForm.images && productForm.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {productForm.images.map((imgUrl, idx) => {
                    const isCover = idx === 0 || imgUrl === productForm.imageUrl;
                    const formatted = imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/${imgUrl}`;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border p-1 bg-card flex flex-col justify-between group ${
                          isCover ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-border/40'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary/40">
                          <img
                            src={formatted}
                            alt={`Galeri ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/batik.jpg';
                            }}
                          />
                          {isCover && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground shadow-sm flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Cover
                            </span>
                          )}
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/60 text-white">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-border/20 text-[10px]">
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryGalleryImage(idx)}
                              className="text-primary hover:underline font-semibold"
                            >
                              Jadikan Cover
                            </button>
                          ) : (
                            <span className="text-primary font-bold">Foto Utama</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImageFromGallery(idx)}
                            className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-500/10"
                            title="Hapus foto dari galeri"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed border-border/50 rounded-xl text-xs text-muted-foreground">
                  Belum ada foto dalam galeri. Tambahkan foto di atas atau pilih dari preset cepat.
                </div>
              )}
            </div>

            {/* 3. DESKRIPSI & CERITA PRODUK */}
            <div className="space-y-3 pt-3 border-t border-border/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 3. Deskripsi & Kisah Filosofi
              </h4>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Deskripsi Singkat (Tampil di kartu katalog)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat produk dalam 1 - 2 kalimat..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Kisah Lengkap & Nilai Budaya (Tampil di halaman detail produk)
                </label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan sejarah pembuatan, filosofi motif, khasiat bahan alami, atau ketelitian pengrajin Desa Wukirsari..."
                  value={productForm.fullDescription}
                  onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Poin Keunggulan Utama (Pisahkan dengan tanda koma)
                </label>
                <Input
                  placeholder="Contoh: 100% Batik Tulis Canting, Pewarna Alami, Sertifikat Pengrajin, Bebas Pengawet"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  className="text-xs h-9"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Poin-poin ini akan tampil sebagai lencana keunggulan di samping harga.
                </span>
              </div>
            </div>

            {/* 4. SPESIFIKASI TEKNIS DINAMIS */}
            <div className="space-y-3 pt-3 border-t border-border/20">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5" /> 4. Tabel Spesifikasi Produk
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpecRow}
                  className="h-7 px-2.5 text-[11px] rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Baris
                </Button>
              </div>

              <div className="space-y-2">
                {productForm.specifications && productForm.specifications.length > 0 ? (
                  productForm.specifications.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <Input
                        placeholder="Label (misal: Bahan, Ukuran, Proses)"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpecRow(sIdx, 'label', e.target.value)}
                        className="text-xs h-8 w-1/3"
                      />
                      <Input
                        placeholder="Nilai (misal: Katun Mori Primissima, 240x115cm)"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecRow(sIdx, 'value', e.target.value)}
                        className="text-xs h-8 flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(sIdx)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 rounded hover:bg-rose-500/10"
                        title="Hapus baris spesifikasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center border border-dashed border-border/40 rounded-xl text-xs text-muted-foreground">
                    Belum ada spesifikasi khusus. Klik &quot;+ Tambah Baris&quot; untuk menambahkan detail teknis.
                  </div>
                )}
              </div>
            </div>

            {/* 5. OPSIONAL: BADGE BARU */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/20">
              <input
                type="checkbox"
                id="isNewCheck"
                checked={productForm.isNew}
                onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="isNewCheck" className="text-xs font-semibold text-foreground cursor-pointer">
                Tandai sebagai Produk Unggulan / Baru (Akan tampil dengan lencana &apos;BARU&apos;)
              </label>
            </div>

            {/* FOOTER AKSI MODAL */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsProductModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold text-xs px-5">
                {editingProduct ? 'Simpan Perubahan Produk' : 'Terbitkan Produk Sekarang'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ADD / EDIT CATEGORY ================= */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Kategori baru akan langsung dapat dipilih pada produk dan filter pencarian.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCategory} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Nama Kategori *</label>
              <Input
                required
                placeholder="Contoh: Agrowisata & Madu"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Slug (Opsional)</label>
              <Input
                placeholder="agrowisata-madu"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Deskripsi Singkat</label>
              <textarea
                rows={2}
                placeholder="Penjelasan singkat mengenai kategori ini..."
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold text-xs">
                {editingCategory ? 'Simpan Kategori' : 'Buat Kategori'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ADD / EDIT EVENT ================= */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingEvent ? 'Edit Agenda Acara' : 'Tambah Agenda Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Agenda ini akan tampil di Kalender Agenda dan hasil pencarian.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Judul Agenda *</label>
              <Input
                required
                placeholder="Contoh: Kirab Budaya Giriloyo"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Tanggal *</label>
                <Input
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Waktu / Jam</label>
                <Input
                  placeholder="09:00 - Selesai"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Lokasi</label>
                <Input
                  placeholder="Lapangan Wukirsari"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Kategori</label>
                <Input
                  placeholder="Budaya / Adat"
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Deskripsi Acara</label>
              <textarea
                rows={2}
                placeholder="Rincian kegiatan..."
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEventModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold text-xs">
                {editingEvent ? 'Simpan Agenda' : 'Tambah Agenda'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm bg-card border-border/40">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-2 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-foreground">
              Hapus Data Ini?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus &ldquo;<strong className="text-foreground">{deleteTarget?.name}</strong>&rdquo;?
              Data yang dihapus akan segera hilang dari katalog web.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              className="text-xs w-24"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              className="text-xs w-24"
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPage;
