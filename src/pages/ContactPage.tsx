import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Building, MessageSquare, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { submitContactRequest } from '../lib/api';

interface ContactPageProps {
  productContext?: any;
}

export const ContactPage: React.FC<ContactPageProps> = ({ productContext }) => {
  const { t } = useLanguage();

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
      const result = await submitContactRequest({
        full_name: name,
        phone_number: phone,
        email,
        subject,
        message,
        ip_address: ''
      });

      if (result) {
        setSuccessMessage('پیام شما با موفقیت ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.');
      } else {
        setErrorMsg('خطا در ارسال پیام. لطفاً مجدداً تلاش کنید.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('ارتباط با سرور برقرار نشد.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-right dir-rtl">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>ارتباط مستقیم با کارخانه و شوروم مرکزی</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          تماس با ما و مشاوره تخصصی الماس سرام
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          آماده پاسخگویی به سوالات معماران، مجریان و خریداران عمده کاشی و سرامیک پرسلان
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-400" />
            <span>ارسال پیام یا درخواست استعلام قیمت</span>
          </h2>

          {successMsg ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">پیام شما با موفقیت ثبت شد</h3>
              <p className="text-xs text-slate-300">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-slate-300 mb-1 block font-bold">نام و نام خانوادگی / نام پروژه *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: مهندس حسینی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 mb-1 block font-bold">شماره همراه تماس *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-1 block font-bold">پست الکترونیکی (اختیاری)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 mb-1 block font-bold">موضوع درخواست</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 mb-1 block font-bold">متن پیام یا مشخصات پروژه *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="توضیحات مربوط به متراژ، محل تحویل یا سوالات فنی..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'در حال ارسال پیام...' : 'ارسال درخواست به دفتر مرکزی الماس سرام'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Google Maps Embed */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>مشخصات دفتر مرکزی و شوروم</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">تلفن‌های تماس دفتر فروش:</div>
                  <div className="font-mono text-amber-300 mt-0.5">۰۲۱-۸۸۸۸۴۴۲۲ / ۰۲۱-۸۸۸۸۴۴۲۳ (۱۰ خط)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">پست الکترونیکی رسمی:</div>
                  <div className="font-mono text-amber-300 mt-0.5">info@almasceram.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">آدرس شوروم مرکزی:</div>
                  <div className="text-slate-300 mt-0.5 leading-relaxed">تهران، خیابان ملاصدرا، پلاک ۱۲۰، مرکز کاشی و سرامیک</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">ساعات کاری شوروم:</div>
                  <div className="text-slate-300 mt-0.5">شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۳:۳۰</div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Location Embed */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <iframe
              title="Almas Ceram Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.948512142204!2d51.3890!3d35.7500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzAwLjAiTiA1McKwMjMnMjAuNCJF!5e0!3m2!1sen!2sir!4v1620000000000!5m2!1sen!2sir"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2)' }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
