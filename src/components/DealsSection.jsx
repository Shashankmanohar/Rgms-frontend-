import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCcw, BadgeCheck } from 'lucide-react';
import { dealsProducts as fallbackDealsProducts, trustItems } from '../mock/mock';
import ProductCard from './ProductCard';
import useCarousel from '../hooks/useCarousel';
import { NavArrow, Dots } from './CarouselControls';
import { useProducts } from '../context/ProductContext';

const getTarget = () => {
  const saved = localStorage.getItem('rgms_deal_target');
  if (saved && Number(saved) > Date.now()) return Number(saved);
  const target = Date.now() + (2 * 24 * 3600 + 18 * 3600 + 45 * 60 + 30) * 1000;
  localStorage.setItem('rgms_deal_target', String(target));
  return target;
};

const Countdown = () => {
  const [target] = useState(getTarget);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  const units = [
    { v: days, l: 'Days' },
    { v: hours, l: 'Hours' },
    { v: mins, l: 'Mins' },
    { v: secs, l: 'Secs' },
  ];

  return (
    <div className="flex gap-2 md:gap-2.5" data-testid="countdown-timer">
      {units.map((u) => (
        <div key={u.l} className="bg-[#082f89] text-white rounded-xl w-[52px] h-[56px] flex flex-col items-center justify-center shadow-[0_6px_16px_rgba(8,47,137,0.3)]">
          <span className="text-[17px] font-bold leading-none tabular-nums">{String(u.v).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-[0.14em] mt-1 text-[#e8eeff]">{u.l}</span>
        </div>
      ))}
    </div>
  );
};

const iconMap = { truck: Truck, shield: ShieldCheck, refresh: RefreshCcw, badge: BadgeCheck };

export const TrustBar = () => (
  <div className="bg-[#f8fafc] py-8 border-y border-slate-200/80" data-testid="trust-bar">
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {trustItems.map((item, idx) => {
          const Icon = iconMap[item.icon];
          const isGreen = idx % 2 !== 0;
          return (
            <div 
              key={item.title} 
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(8,47,137,0.05)] border border-slate-100 flex items-center gap-4 hover:shadow-[0_12px_32px_rgba(8,47,137,0.12)] hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                isGreen 
                  ? 'bg-[#01a345]/12 text-[#01a345] group-hover:bg-[#01a345] group-hover:text-white shadow-xs' 
                  : 'bg-[#082f89]/10 text-[#082f89] group-hover:bg-[#082f89] group-hover:text-white shadow-xs'
              }`}>
                <Icon size={24} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-black text-[#07152e] group-hover:text-[#082f89] transition-colors leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-[#64748b] font-medium leading-snug mt-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const DealsSection = () => {
  const { dealsProductsList } = useProducts();
  const activeDeals = dealsProductsList && dealsProductsList.length > 0 ? dealsProductsList : fallbackDealsProducts;
  const carousel = useCarousel({ autoplay: false });

  return (
    <section className="bg-gradient-to-b from-[#e8eeff] via-[#f1f5f9] to-[#ffffff] pb-14 md:pb-16" data-testid="deals-section">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#f00102] text-white text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.1em] mb-2 shadow-[0_6px_14px_rgba(240,1,2,0.28)]">
              Limited Time
            </span>
            <h2 className="text-h2 text-[#07152e]">
              Deals in <span className="text-[#082f89]">FOCUS</span>
            </h2>
          </div>
          <Countdown />
        </div>

        {activeDeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm text-slate-500 font-bold text-xs sm:text-sm">
            No deal products currently listed. Add or flag products in the Admin Panel to display here!
          </div>
        ) : (
          <div className="relative">
            <NavArrow dir="left" onClick={carousel.prev} className="absolute -left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-10 hidden sm:flex" />
            <div
              {...carousel.scrollerProps}
              className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 sm:mx-0 px-4 sm:px-0 pb-3 focus:outline-none"
              aria-label="Featured deals"
              data-testid="deals-scroller"
            >
              {activeDeals.map((p) => (
                <div key={p.id} data-slide className="w-[82vw] sm:w-[280px] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] flex-none snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <NavArrow dir="right" onClick={carousel.next} className="absolute -right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-10 hidden sm:flex" />
          </div>
        )}

        <Dots count={activeDeals.length} activeIndex={carousel.activeIndex} onSelect={carousel.scrollToIndex} className="mt-6" />

        <div className="flex justify-center mt-8">
          <Link to="/products" className="bg-white border border-[#d4dce7] hover:border-[#082f89] hover:text-[#082f89] text-[#1e2c45] text-[13px] font-bold px-7 py-3 rounded-full transition-colors shadow-sm hover:-translate-y-0.5 duration-200" data-testid="deals-view-all">
            View All Sale Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
