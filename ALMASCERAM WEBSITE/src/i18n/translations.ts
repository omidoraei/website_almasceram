export type Language = 'fa' | 'en' | 'ar';

export interface TranslationKeys {
  brandName: string;
  tagline: string;
  officialCatalog: string;
  searchPlaceholder: string;
  standardSizes: string;
  allSizes: string;
  inquiryList: string;
  contactUs: string;
  visualizer: string;
  adminPanel: string;
  architecture: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroTitle2: string;
  zeroWater: string;
  rectifiedLaser: string;
  facesCountLabel: string;
  filterTitle: string;
  resetFilters: string;
  surfaceFinish: string;
  bodyType: string;
  collections: string;
  addToInquiry: string;
  inInquiry: string;
  compare: string;
  quickView: string;
  productCode: string;
  thickness: string;
  whatsAppMessageWelcome: string;
  whatsAppMessageProduct: (title: string, code: string, size: string) => string;
  whatsAppTooltipWelcome: string;
  whatsAppTooltipProduct: (title: string, code: string, size: string) => string;
}

export const TRANSLATIONS: Record<Language, TranslationKeys> = {
  fa: {
    brandName: 'الماس سرام',
    tagline: 'کاشی و سرامیک پرسلان معمارانه',
    officialCatalog: 'کاتالوگ رسمی پرسلان‌های لوکس الماس سرام — گواهینامه ISO 10545',
    searchPlaceholder: 'جستجوی کد محصول، اونیکس، کلکته، اسلب ۱۰۰x۱۰۰...',
    standardSizes: 'سایزهای استاندارد تولید:',
    allSizes: 'همه سایزها',
    inquiryList: 'لیست استعلام قیمت',
    contactUs: 'تماس با ما و فرم استعلام',
    visualizer: 'شبیه‌ساز چیدمان',
    adminPanel: 'پنل مدیریت ادمین',
    architecture: 'معماری نرم‌افزار',
    heroHeadline: 'درخشش بی‌بدیل در کاتالوگ رسمی الماس سرام',
    heroSubheadline: 'تولیدکننده پرسلان‌های اسلب، فول‌بادی و لعاب‌دار لوکس نمای ساختمان و دیوارهای داخلی.',
    heroTitle2: 'کاتالوگ جامع کاشی و سرامیک الماس سرام',
    zeroWater: 'جذب آب زیر ۰.۱٪',
    rectifiedLaser: 'برش لیزری رکتیفاید',
    facesCountLabel: 'فیس متغیر',
    filterTitle: 'فیلترهای تخصصی کاتالوگ',
    resetFilters: 'حذف فیلترها',
    surfaceFinish: 'نوع سطح (Finish)',
    bodyType: 'نوع بدنه (Body)',
    collections: 'کالکشن‌ها',
    addToInquiry: 'افزودن به استعلام',
    inInquiry: 'در لیست استعلام',
    compare: 'مقایسه',
    quickView: 'مشاهده کاتالوگ',
    productCode: 'کد کالا',
    thickness: 'ضخامت',
    whatsAppMessageWelcome: 'سلام، جهت دریافت کاتالوگ و مشاوره خرید کاشی و سرامیک الماس سرام پیام می‌دهم.',
    whatsAppMessageProduct: (title, code, size) => 
      `سلام، درباره کاشی ${title} (کد: ${code}، سایز: ${size} cm) سوال داشتم و درخواست استعلام قیمت دارم.`,
    whatsAppTooltipWelcome: 'مشاوره آنلاین و دریافت کاتالوگ در واتساپ',
    whatsAppTooltipProduct: (title, code, size) => 
      `سلام، درباره کاشی ${title} (کد: ${code}، سایز: ${size} cm) سوال داشتم و درخواست استعلام قیمت دارم.`
  },
  en: {
    brandName: 'ALMAS CERAM',
    tagline: 'Architectural Porcelain Tiles',
    officialCatalog: 'Official Almas Ceram Porcelain Catalog — ISO 10545 Certified',
    searchPlaceholder: 'Search tile code, collection, Onyx, Calacatta...',
    standardSizes: 'Standard Production Sizes:',
    allSizes: 'All Sizes',
    inquiryList: 'Price Inquiry Basket',
    contactUs: 'Contact & Inquiry',
    visualizer: 'Room Visualizer',
    adminPanel: 'Admin Panel',
    architecture: 'Architecture Spec',
    heroHeadline: 'Unrivaled Luxury in Almas Ceram Porcelain Catalog',
    heroSubheadline: 'Manufacturer of premium porcelain slabs, full-body, and glazed architectural tiles.',
    heroTitle2: 'Almas Ceram Porcelain Tile Catalog',
    zeroWater: 'Water Absorption <0.1%',
    rectifiedLaser: 'Laser-Cut Rectified',
    facesCountLabel: 'Random Faces',
    filterTitle: 'Catalog Specifications Filter',
    resetFilters: 'Reset Filters',
    surfaceFinish: 'Surface Finish',
    bodyType: 'Body Type',
    collections: 'Collections',
    addToInquiry: 'Add to Inquiry',
    inInquiry: 'In Inquiry List',
    compare: 'Compare',
    quickView: 'View Specs',
    productCode: 'Code',
    thickness: 'Thickness',
    whatsAppMessageWelcome: 'Hello, I am reaching out for Almas Ceram catalog and tile consultation.',
    whatsAppMessageProduct: (title, code, size) => 
      `Hello, I have an inquiry regarding ${title} (Code: ${code}, Size: ${size} cm).`,
    whatsAppTooltipWelcome: 'Online consultation and catalog on WhatsApp',
    whatsAppTooltipProduct: (title, code, size) => 
      `Hello, I have an inquiry regarding ${title} (Code: ${code}, Size: ${size} cm).`
  },
  ar: {
    brandName: 'الماس سيرام',
    tagline: 'كتالوج سيراميك البورسلين المعماري',
    officialCatalog: 'الكتالوج الرسمي لبورسلين الماس سيرام — شهادة ISO 10545',
    searchPlaceholder: 'البحث عن رمز البلاط، أونيكس، كالاكاتا، بلاط...',
    standardSizes: 'الأحجام القياسية للانتاج:',
    allSizes: 'جميع الأحجام',
    inquiryList: 'سلة استفسار الأسعار',
    contactUs: 'اتصل بنا والاستفسار',
    visualizer: 'محاكي التصميم',
    adminPanel: 'لوحة التحكم',
    architecture: 'هندسة البرمجيات',
    heroHeadline: 'الفخامة المطلقة في كتالوج الماس سيرام',
    heroSubheadline: 'مصنع بلاط البورسلين الفاخر للواجهات والأرضيات والجدران الداخلية.',
    heroTitle2: 'كتالوج سيراميك الماس الفاخر',
    zeroWater: 'امتصاص الماء <۰.۱٪',
    rectifiedLaser: 'قطع ليزري مستقيم',
    facesCountLabel: 'وجوه متغيرة',
    filterTitle: 'تصفية مواصفات الكتالوج',
    resetFilters: 'إعادة ضبط',
    surfaceFinish: 'نوع السطح',
    bodyType: 'نوع الهيكل',
    collections: 'المجموعات',
    addToInquiry: 'إضافة للاستفسار',
    inInquiry: 'في قائمة الاستفسار',
    compare: 'مقارنة',
    quickView: 'عرض المواصفات',
    productCode: 'الرمز',
    thickness: 'السُمك',
    whatsAppMessageWelcome: 'مرحباً، أود الاستفسار عن كتالوج سيراميك الماس.',
    whatsAppMessageProduct: (title, code, size) => 
      `مرحباً، لدي استفسار بخصوص بلاط ${title} (رمز: ${code}، مقاس: ${size} سم).`,
    whatsAppTooltipWelcome: 'استشارة أونلاين والكتالوج على واتساب',
    whatsAppTooltipProduct: (title, code, size) => 
      `مرحباً، لدي استفسار بخصوص بلاط ${title} (رمز: ${code}، مقاس: ${size} سم).`
  }
};
