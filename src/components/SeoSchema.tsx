import React from 'react';
import { Product } from '../types/tile';
import { Language } from '../i18n/translations';

interface SeoSchemaProps {
  product?: Product | null;
  currentLang?: Language;
}

export const SeoSchema: React.FC<SeoSchemaProps> = ({ product, currentLang = 'fa' }) => {
  const baseUrl = 'https://almasceram.com';

  // 1. Organization Schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'الماس سرام (ALMAS CERAM)',
    'alternateName': 'صنایع کاشی و سرامیک الماس سرام',
    'url': baseUrl,
    'logo': `${baseUrl}/favicon.svg`,
    'sameAs': [
      'https://instagram.com/almasceram',
      'https://linkedin.com/company/almasceram'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+98-21-88884422',
      'contactType': 'sales',
      'areaServed': ['IR', 'AE', 'RU', 'IQ'],
      'availableLanguage': ['Persian', 'English', 'Arabic']
    }
  };

  // 2. Product & Offer Schema
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title_fa,
    'image': [product.image_url, ...(product.face_images || [])],
    'description': product.description || `${product.title_fa} - پرسلان سایز ${product.size} cm`,
    'sku': product.code,
    'mpn': product.code,
    'brand': {
      '@type': 'Brand',
      'name': 'ALMAS CERAM'
    },
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}/?product=${product.code}`,
      'priceCurrency': 'IRR',
      'availability': 'https://schema.org/InStock',
      'itemCondition': 'https://schema.org/NewCondition'
    }
  } : null;

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'تفاوت پرسلان فول‌بادی با پرسلان لعاب‌دار چیست؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'در پرسلان فول‌بادی بدنه یکدست است. پرسلان لعاب‌دار دارای لایه لعاب کریستالی محافظ با درخشش بالا است.'
        }
      },
      {
        '@type': 'Question',
        'name': 'آیا کاشی‌های الماس سرام برای نمای بیرونی و مناطق سردسیر مناسب هستند؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'بله، تمامی محصولات دارای جذب آب زیر ۰.۱ درصد بوده و در برابر شوک حرارتی و یخ‌زدگی ۱۰۰٪ مقاوم هستند.'
        }
      }
    ]
  };

  const pageTitle = product 
    ? `${product.title_fa} (سایز ${product.size} cm) | الماس سرام` 
    : 'کاتالوگ محصولات کاشی و سرامیک الماس سرام | ALMAS CERAM';

  const pageDesc = product
    ? `${product.title_fa} - پرسلان ${product.surface_finish} سایز ${product.size} cm. تولیدشده با استاندارد ISO 10545.`
    : 'کاتالوگ رسمی پرسلان‌های اسلب و ابعاد استاندارد کارخانه کاشی و سرامیک الماس سرام.';

  const pageImage = product ? product.image_url : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      {/* Dynamic OpenGraph & Twitter Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />

      <meta property="og:type" content={product ? 'product' : 'website'} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:site_name" content="ALMAS CERAM" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />

      {/* Multi-language hreflang SEO tags */}
      <link rel="alternate" hrefLang="fa" href={`${baseUrl}/?lang=fa`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/?lang=en`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* Structured JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
    </>
  );
};
