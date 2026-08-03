import React from 'react';
import { Building2, Palette, Ruler, Award } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { StatBadge } from '../ui/StatBadge';

export function SkillsShowcase() {
  const skills = [
    {
      icon: <Building2 className="w-5 h-5" />,
      value: '۲۵+',
      label: 'سال تجربه',
      description: 'تخصص در تولید کاشی و سرامیک'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      value: '۵۰۰+',
      label: 'طرح منحصر به فرد',
      description: 'کالکشن‌های متنوع و لوکس'
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      value: '۷',
      label: 'سایز استاندارد',
      description: 'از ۳۰x۳۰ تا ۱۰۰x۱۰۰ اسلب'
    },
    {
      icon: <Award className="w-5 h-5" />,
      value: 'ISO',
      label: 'گواهینامه بین‌المللی',
      description: 'استانداردهای جهانی کیفیت'
    }
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      {/* Background ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-light orb-amber w-96 h-96 -top-48 -right-48" />
        <div className="orb-light orb-slate w-80 h-80 -bottom-40 -left-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              <span className="gradient-text-gold">مهارت‌ها و تخصص</span>
              <span className="text-slate-400"> الماس سرام</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              ترکیبی از هنر، تکنولوژی و تجربه برای خلق محصولات استثنایی
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skills.map((skill, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="glass-luxury rounded-3xl p-6 text-center hover:glow-amber-sm transition-all duration-500 group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-black gradient-text-gold mb-2">
                  {skill.value}
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {skill.label}
                </div>
                <div className="text-xs text-slate-400">
                  {skill.description}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
