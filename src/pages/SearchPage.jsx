import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  ArrowUpDown,
  Tag,
  Store,
  RotateCcw,
  PackageSearch,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/DataContext';
import { ProductCard, PaymentModal } from '@/components/common/ProductCard';

const popularKeywords = ['Batik', 'Wedang Uwuh', 'Wayang', 'Thiwul', 'Kipas', 'Festival', 'Giriloyo'];

const SearchPage = () => {
  const { products, categories, events } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || 'Semua';
  const tabParam = searchParams.get('tab') || 'semua';
  const sortParam = searchParams.get('sort') || 'default';
  const onlyNewParam = searchParams.get('onlyNew') === 'true';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [activeTab, setActiveTab] = useState(tabParam); // 'semua' | 'produk' | 'agenda'
  const [sortBy, setSortBy] = useState(sortParam);
  const [onlyNew, setOnlyNew] = useState(onlyNewParam);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Update query in state when URL param changes
  React.useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
    setActiveTab(tabParam);
    setSortBy(sortParam);
    setOnlyNew(onlyNewParam);
  }, [queryParam, categoryParam, tabParam, sortParam, onlyNewParam]);

  // Sync state to URL params
  const updateParams = (newQuery, newCat, newTab, newSort, newOnlyNew) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCat && newCat !== 'Semua') params.set('cat', newCat);
    if (newTab && newTab !== 'semua') params.set('tab', newTab);
    if (newSort && newSort !== 'default') params.set('sort', newSort);
    if (newOnlyNew) params.set('onlyNew', 'true');
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    updateParams(value, selectedCategory, activeTab, sortBy, onlyNew);
  };

  const handleCategorySelect = (catName) => {
    const nextCat = selectedCategory === catName ? 'Semua' : catName;
    setSelectedCategory(nextCat);
    updateParams(searchQuery, nextCat, activeTab, sortBy, onlyNew);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    updateParams(searchQuery, selectedCategory, tab, sortBy, onlyNew);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateParams(searchQuery, selectedCategory, activeTab, newSort, onlyNew);
  };

  const handleToggleOnlyNew = () => {
    const next = !onlyNew;
    setOnlyNew(next);
    updateParams(searchQuery, selectedCategory, activeTab, sortBy, next);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setActiveTab('semua');
    setSortBy('default');
    setOnlyNew(false);
    setSearchParams({});
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }
      // Only new filter
      if (onlyNew && !item.isNew) {
        return false;
      }
      // Search query filter
      if (!q) return true;
      const matchName = item.name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchUmkm = item.umkm?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      return matchName || matchDesc || matchUmkm || matchCat;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.priceNum || 0) - (b.priceNum || 0);
      if (sortBy === 'price-desc') return (b.priceNum || 0) - (a.priceNum || 0);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, onlyNew, sortBy]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return events.filter((evt) => {
      if (selectedCategory !== 'Semua') {
        // Event category matching
        const matchCategory =
          evt.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(evt.category?.toLowerCase() || '');
        if (!matchCategory) return false;
      }
      if (!q) return true;
      const matchTitle = evt.title?.toLowerCase().includes(q);
      const matchLoc = evt.location?.toLowerCase().includes(q);
      const matchDesc = evt.description?.toLowerCase().includes(q);
      const matchCat = evt.category?.toLowerCase().includes(q);
      return matchTitle || matchLoc || matchDesc || matchCat;
    });
  }, [events, searchQuery, selectedCategory]);

  const totalResultsCount = filteredProducts.length + filteredEvents.length;
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== 'Semua' ||
    sortBy !== 'default' ||
    onlyNew ||
    activeTab !== 'semua';

  return (
    <>
      <Helmet>
        <title>Pencarian Pintar - WukirTech</title>
        <meta
          name="description"
          content="Cari produk UMKM, kerajinan tangan, batik, kuliner khas, dan agenda budaya di Desa Wukirsari secara dinamis dan cepat."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Search className="w-3.5 h-3.5" />
              <span>Sistem Pencarian Terpadu WukirTech</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              Temukan Semua di <span className="text-primary">Wukirsari</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Jelajahi karya batik, kuliner khas, cenderamata, hingga agenda festival budaya dengan cepat & dinamis.
            </p>
          </motion.div>

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl p-4 md:p-6 shadow-xl shadow-black/10 mb-8"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari produk, pengrajin UMKM, batik, kuliner, agenda..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-12 h-13 text-base md:text-lg bg-background/70 border-border/40 rounded-xl focus-visible:ring-primary shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular keyword chips */}
            <div className="flex items-center flex-wrap gap-2 mt-4 text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" /> Populer:
              </span>
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => handleSearchChange(kw)}
                  className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-all duration-200 border border-border/20 text-xs"
                >
                  {kw}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Filter Berdasarkan Kategori
              </span>
              <span className="text-xs text-muted-foreground">
                {categories.length} Kategori Tersedia
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20">
              <button
                onClick={() => handleCategorySelect('Semua')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border flex items-center gap-2 ${
                  selectedCategory === 'Semua'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                    : 'bg-card/70 hover:bg-secondary text-muted-foreground border-border/30'
                }`}
              >
                <span>Semua</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedCategory === 'Semua' ? 'bg-black/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                        : 'bg-card/70 hover:bg-secondary text-muted-foreground border-border/30'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-black/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls Bar: Tabs, Sort, and Status */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-card/60 border border-border/30 rounded-2xl mb-8 backdrop-blur-md">
            {/* View Tabs */}
            <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-xl">
              <button
                onClick={() => handleTabSelect('semua')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'semua'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua Hasil ({totalResultsCount})
              </button>
              <button
                onClick={() => handleTabSelect('produk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'produk'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                Produk ({filteredProducts.length})
              </button>
              <button
                onClick={() => handleTabSelect('agenda')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'agenda'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Agenda ({filteredEvents.length})
              </button>
            </div>

            {/* Sort & Toggle controls */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Only New Toggle */}
              <button
                onClick={handleToggleOnlyNew}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  onlyNew
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-secondary/40 text-muted-foreground border-border/30 hover:bg-secondary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hanya Baru
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-secondary/40 px-2.5 py-1 rounded-xl border border-border/30 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="default" className="bg-card text-foreground">Urutkan: Bawaan</option>
                  <option value="price-asc" className="bg-card text-foreground">Harga: Termurah</option>
                  <option value="price-desc" className="bg-card text-foreground">Harga: Termahal</option>
                  <option value="name-asc" className="bg-card text-foreground">Nama: A - Z</option>
                  <option value="name-desc" className="bg-card text-foreground">Nama: Z - A</option>
                  <option value="newest" className="bg-card text-foreground">Produk Terbaru</option>
                </select>
              </div>

              {/* Reset Filters button if any active */}
              {isFiltered && (
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan{' '}
              <strong className="text-foreground">
                {activeTab === 'produk'
                  ? filteredProducts.length
                  : activeTab === 'agenda'
                  ? filteredEvents.length
                  : totalResultsCount}
              </strong>{' '}
              hasil
              {searchQuery && (
                <>
                  {' '}untuk kata kunci &ldquo;<span className="text-primary font-medium">{searchQuery}</span>&rdquo;
                </>
              )}
              {selectedCategory !== 'Semua' && (
                <>
                  {' '}dalam kategori &ldquo;<span className="text-foreground font-medium">{selectedCategory}</span>&rdquo;
                </>
              )}
            </p>

            <Link
              to="/admin"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              + Kelola Data di Admin
            </Link>
          </div>

          {/* Main Results Display */}
          <div className="max-w-6xl mx-auto">
            {/* Products Section */}
            {(activeTab === 'semua' || activeTab === 'produk') && filteredProducts.length > 0 && (
              <div className="mb-12">
                {activeTab === 'semua' && (
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/20">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">
                      Produk UMKM Wukirsari ({filteredProducts.length})
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        onSelect={(prod) => setSelectedProduct(prod)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Section */}
            {(activeTab === 'semua' || activeTab === 'agenda') && filteredEvents.length > 0 && (
              <div className="mb-12">
                {activeTab === 'semua' && (
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/20">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-bold text-foreground">
                      Agenda & Festival Budaya ({filteredEvents.length})
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card/80 border border-border/30 rounded-2xl p-5 hover:border-cyan-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            {evt.category || 'Budaya'}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {evt.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-2">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/20 space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{evt.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalResultsCount === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-4 bg-card/40 rounded-3xl border border-dashed border-border/60 max-w-xl mx-auto"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground mb-4">
                  <PackageSearch className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Tidak Ada Hasil Ditemukan
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Tidak ada produk atau agenda yang cocok dengan pencarian{' '}
                  {searchQuery && <strong className="text-foreground">&ldquo;{searchQuery}&rdquo;</strong>}
                  {selectedCategory !== 'Semua' && (
                    <> pada kategori <strong className="text-foreground">{selectedCategory}</strong></>
                  )}.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={handleClearFilters} variant="outline" size="sm">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Reset Pencarian
                  </Button>
                  <Link to="/produk">
                    <Button size="sm">
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      Jelajahi Produk
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Payment / Order Modal */}
      <PaymentModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default SearchPage;
