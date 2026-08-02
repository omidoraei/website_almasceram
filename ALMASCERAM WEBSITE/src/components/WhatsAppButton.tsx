import React from 'react';
import { Product } from '../types/tile';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { trackWhatsAppClick } from '../lib/analytics';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  currentProduct?: Product | null;
  lang?: Language;
}

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '989121112233';

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ currentProduct, lang = 'fa' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fa;

  const rawMessage = currentProduct
    ? t.whatsAppMessageProduct(currentProduct.title_fa, currentProduct.code, currentProduct.size)
    : t.whatsAppMessageWelcome;

  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodedMessage}`;

  const handleClick = () => {
    trackWhatsAppClick(currentProduct?.code);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center group dir-rtl">
      <div className="relative">
        {/* Subtle Pulse Aura Ring */}
        <div className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-500/60 transition-all duration-300 animate-pulse pointer-events-none" />

        {/* Clean Icon-Only Floating Button */}
        <button
          onClick={handleClick}
          className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-emerald-300/40 cursor-pointer"
          aria-label="چت مستقیم در واتساپ"
        >
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </button>
      </div>
    </div>
  );
};
