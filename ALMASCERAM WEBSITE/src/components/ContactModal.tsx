import React, { useState } from 'react';
import { Product } from '../types/tile';
import { X, Send, Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, ShieldCheck, Building } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  productContext?: Product | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, productContext }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(
    productContext ? `استعلام قیمت کاشی ${productContext.title_fa}` : 'مشاوره و دریافت کاتالوگ'
  );
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Anti-spam honeypot

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          subject,
          message,
          product_code: productContext?.code || '',
          product_title: productContext?.title_fa || '',
          website // honeypot
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'پیام شما با موفقیت دریافت شد.');
      } else {
        setErrorMsg(data.error || 'خطا در ارسال پیام.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('ارتباط با سرور برقرار نشد.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto dir-rtl">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-mono">CONTACT & INQUIRY CENTER</span>
            <h2 className="text-lg font-extrabold text-white">تماس با ما و استعلام تخصصی کاشی الماس سرام</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {successMsg ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">پیام شما با موفقیت ثبت گردید</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">{successMsg}</p>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                متوجه شدم
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Left Column: Contact Form */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-sm font-bold text-amber-300">ارسال پیام یا درخواست استعلام قیمت</h3>

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  {/* Honeypot field (hidden from real users) */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label className="text-slate-300 mb-1 block">نام و نام خانوادگی / نام پروژه *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: مهندس حسینی"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 mb-1 block">شماره همراه تماس *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 mb-1 block">پست الکترونیکی (اختیاری)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@domain.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block">موضوع درخواست</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 mb-1 block">متن پیام یا مشخصات پروژه *</label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="توضیحات مربوط به متراژ، محل تحویل یا سوالات فنی..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'در حال ارسال پیام...' : 'ارسال درخواست به کارخانه الماس سرام'}</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Contact Details & Google Maps */}
              <div className="md:col-span-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-300">دفتر مرکزی و شو‌روم الماس سرام</h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                  <p className="flex items-center gap-2 text-slate-200">
                    <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>تلفن فروش: ۰۲۱-۸۸۸۸۴۴۲۲ (۱۰ خط)</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>ایمیل: info@almasceram.com</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-200">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>آدرس: تهران، خیابان ملاصدرا، پلاک ۱۲۰، مرکز کاشی و سرامیک</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-200">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>ساعات کاری: شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰</span>
                  </p>
                </div>

                {/* Google Maps Simulation Embed */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <iframe
                    title="Almas Ceram Showroom Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.948512142204!2d51.3890!3d35.7500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzAwLjAiTiA1McKwMjMnMjAuNCJF!5e0!3m2!1sen!2sir!4v1620000000000!5m2!1sen!2sir"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2)' }}
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-950/90 text-[10px] text-amber-400 px-2 py-1 rounded font-mono border border-amber-500/30">
                    Google Maps Showroom Location
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
