import React, { useState, useEffect, useMemo } from 'react';
import { Product, Collection, FilterState, InquiryItem } from './types/tile';
import { Language, TRANSLATIONS } from './i18n/translations';
import { Header, PageView } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FilterSidebar } from './components/FilterSidebar';
import { CompareModal } from './components/CompareModal';
import { InquiryBasketModal } from './components/InquiryBasketModal';
import { RoomVisualizer } from './components/RoomVisualizer';
import { ArchitectureView } from './components/ArchitectureView';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ContactModal } from './components/ContactModal';
import { SeoSchema } from './components/SeoSchema';
import { SizeGridShowcase } from './components/SizeGridShowcase';
import { AboutSnippet } from './components/AboutSnippet';
import { FeaturedProductsShowcase } from './components/FeaturedProductsShowcase';
import { FinalCtaSection } from './components/FinalCtaSection';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { FaqPage } from './pages/FaqPage';
import { StandardsPage } from './pages/StandardsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { trackTileView } from './lib/analytics';
import { Filter, Sparkles, RefreshCw, AlertCircle, Lock, MessageSquare } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [activePage, setActivePage] = useState<PageView>('catalog');
  const [viewMode, setViewMode] = useState<'catalog' | 'admin'>('catalog');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickSize, setSelectedQuickSize] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sizes: [],
    finishes: [],
    bodyType: '',
    collection: '',
    colorFamily: '',
    application: ''
  });

  // Modals & Drawers State
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [inquiryBasket, setInquiryBasket] = useState<InquiryItem[]>([]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isRoomVisualizerOpen, setIsRoomVisualizerOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fa;

  // Sync document direction and lang attributes on locale change
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
  }, [currentLang]);

  // Fetch Products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedQuickSize) params.append('size', selectedQuickSize);
      else if (filters.sizes.length > 0) params.append('size', filters.sizes.join(','));
      if (filters.finishes.length > 0) params.append('finish', filters.finishes.join(','));
      if (filters.bodyType) params.append('body', filters.bodyType);
      if (filters.collection) params.append('collection', filters.collection);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('خطا در دریافت لیست محصولات');
      const data = await res.json();
      setProducts(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ارتباط با سرور برقرار نشد.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Collections
  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedQuickSize, filters, viewMode]);

  // Derived filter options from current dataset
  const availableFinishes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.surface_finish).filter(Boolean)));
  }, [products]);

  const availableBodyTypes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.body_type).filter(Boolean)));
  }, [products]);

  const availableCollections = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.collection_name).filter(Boolean)));
  }, [products]);

  // Handlers
  const handleResetFilters = () => {
    setSelectedQuickSize('');
    setSearchQuery('');
    setFilters({
      search: '',
      sizes: [],
      finishes: [],
      bodyType: '',
      collection: '',
      colorFamily: '',
      application: ''
    });
  };

  const handleOpenProductDetail = (p: Product) => {
    setSelectedProductDetail(p);
    trackTileView(p.code, p.title_fa, p.size);
  };

  const handleAddToInquiry = (product: Product) => {
    setInquiryBasket((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product, quantitySqm: 50 }];
    });
  };

  const handleUpdateInquiryQuantity = (productId: number, sqm: number) => {
    setInquiryBasket((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantitySqm: sqm } : item))
    );
  };

  const handleRemoveInquiryItem = (productId: number) => {
    setInquiryBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('حداکثر ۴ محصول را می‌توانید همزمان مقایسه کنید.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleNavigate = (page: PageView) => {
    if (page === 'admin') {
      handleOpenAdminTrigger();
    } else {
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render Admin Panel View if active
  if (viewMode === 'admin' && isAdminAuthenticated) {
    return (
      <AdminDashboard
        onReturnToCatalog={() => {
          setViewMode('catalog');
          fetchProducts();
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 ${
      currentLang === 'en' ? 'dir-ltr' : 'dir-rtl'
    }`}>
      
      {/* SEO Schema & Multi-Language Hreflang Injection */}
      <SeoSchema product={selectedProductDetail} currentLang={currentLang} />

      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSize={selectedQuickSize}
        setSelectedSize={setSelectedQuickSize}
        inquiryCount={inquiryBasket.length}
        openInquiryModal={() => setIsInquiryModalOpen(true)}
        openArchModal={() => setIsArchModalOpen(true)}
        openVisualizerModal={() => setIsRoomVisualizerOpen(true)}
        openAdminModal={handleOpenAdminTrigger}
        openContactModal={() => setIsContactModalOpen(true)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Page Content Switcher */}
      {activePage === 'about' && <AboutPage />}

      {activePage === 'portfolio' && <PortfolioPage />}

      {activePage === 'faq' && <FaqPage />}

      {activePage === 'contact' && <ContactPage productContext={selectedProductDetail} />}

      {activePage === 'standards' && <StandardsPage />}

      {activePage === 'privacy' && <PrivacyPolicyPage />}

      {activePage === 'terms' && <TermsPage />}

      {/* Clean Homepage View (5 High-Impact Sections, No Clogging) */}
      {activePage === 'catalog' && (
        <>
          <Hero
            onSelectSize={(sz) => {
              setSelectedQuickSize(sz);
              handleNavigate('products-catalog');
            }}
            openArchModal={() => setIsArchModalOpen(true)}
            openVisualizerModal={() => setIsRoomVisualizerOpen(true)}
            totalProductsCount={products.length}
          />

          <SizeGridShowcase
            onSelectSize={(sz) => {
              setSelectedQuickSize(sz);
              handleNavigate('products-catalog');
            }}
          />

          <FeaturedProductsShowcase
            products={products}
            onOpenDetail={handleOpenProductDetail}
            onAddToInquiry={handleAddToInquiry}
            inquiryBasket={inquiryBasket}
            onToggleCompare={handleToggleCompare}
            comparedProducts={comparedProducts}
          />

          <AboutSnippet />

          <FinalCtaSection
            openContactModal={() => setIsContactModalOpen(true)}
            openVisualizerModal={() => setIsRoomVisualizerOpen(true)}
            openArchModal={() => setIsArchModalOpen(true)}
          />
        </>
      )}

      {/* Dedicated Products Catalog Gallery Page */}
      {activePage === 'products-catalog' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          {/* Compare Toolbar Alert Bar */}
          {comparedProducts.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs font-medium backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{comparedProducts.length} کاشی برای مقایسه فنی انتخاب شده است.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-xl shadow hover:bg-amber-400 transition-all"
                >
                  مشاهده جدول مقایسه
                </button>
                <button
                  onClick={() => setComparedProducts([])}
                  className="text-slate-400 hover:text-red-400 px-2"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}

          {/* Section Title & Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>گالری کاتالوگ جامع محصولات الماس سرام</span>
                <span className="text-xs font-mono font-normal text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {products.length} کالا
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                فیلتر بر اساس ابعاد 30x30, 40x40, 60x60, 60x120, 80x80, 100x100, 30x90 و نوع سطح
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>{t.contactUs}</span>
              </button>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>{t.filterTitle}</span>
              </button>
            </div>
          </div>

          {/* Catalog Layout: Left Filters + Right Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-28">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                availableFinishes={availableFinishes}
                availableBodyTypes={availableBodyTypes}
                availableCollections={availableCollections}
              />
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="lg:hidden col-span-12">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onResetFilters={handleResetFilters}
                  availableFinishes={availableFinishes}
                  availableBodyTypes={availableBodyTypes}
                  availableCollections={availableCollections}
                />
              </div>
            )}

            {/* Product Grid Area */}
            <div className="lg:col-span-9 space-y-6">
              
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">در حال دریافت جدیدترین محصولات از دیتابیس الماس سرام...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-rose-500/30 space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-sm font-bold text-rose-300">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl"
                  >
                    تلاش مجدد
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <Filter className="w-8 h-8 text-amber-400/60 mx-auto" />
                  <h3 className="text-base font-bold text-white">محصولی با فیلترهای انتخابی یافت نشد</h3>
                  <p className="text-xs text-slate-400">لطفاً فیلترهای سایز یا نوع سطح را تغییر دهید یا دکمه حذف فیلترها را بزنید.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    نمایش تمامی محصولات کاتالوگ
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => {
                    const isInInquiry = inquiryBasket.some((item) => item.product.id === product.id);
                    const isCompared = comparedProducts.some((p) => p.id === product.id);

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenDetail={handleOpenProductDetail}
                        onAddToInquiry={handleAddToInquiry}
                        isInInquiry={isInInquiry}
                        onToggleCompare={handleToggleCompare}
                        isCompared={isCompared}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Dynamic WhatsApp Button */}
      <WhatsAppButton currentProduct={selectedProductDetail} lang={currentLang} />

      {/* Modals */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
          onAddToInquiry={handleAddToInquiry}
          isInInquiry={inquiryBasket.some((item) => item.product.id === selectedProductDetail.id)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedProducts.some((p) => p.id === selectedProductDetail.id)}
          allProducts={products}
          onSelectProduct={(p) => setSelectedProductDetail(p)}
        />
      )}

      {isCompareModalOpen && (
        <CompareModal
          products={comparedProducts}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={(p) => setComparedProducts((prev) => prev.filter((item) => item.id !== p.id))}
          onAddToInquiry={handleAddToInquiry}
        />
      )}

      {isInquiryModalOpen && (
        <InquiryBasketModal
          items={inquiryBasket}
          onClose={() => setIsInquiryModalOpen(false)}
          onRemoveItem={handleRemoveInquiryItem}
          onUpdateQuantity={handleUpdateInquiryQuantity}
          onClearAll={() => setInquiryBasket([])}
        />
      )}

      {isContactModalOpen && (
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          productContext={selectedProductDetail}
        />
      )}

      {isRoomVisualizerOpen && (
        <RoomVisualizer
          products={products}
          onClose={() => setIsRoomVisualizerOpen(false)}
        />
      )}

      {isArchModalOpen && (
        <ArchitectureView
          onClose={() => setIsArchModalOpen(false)}
        />
      )}

      {isAdminAuthModalOpen && (
        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            setViewMode('admin');
          }}
        />
      )}
    </div>
  );
}

export default App;
