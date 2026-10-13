import React from 'react';
import { BurgerCustomization, InvestmentBreakdown } from '../types';
import { Sparkles, Award, Star, Zap, Gift, Tag, Flame } from 'lucide-react';

interface BurgerVisualizerProps {
  customization: BurgerCustomization;
  productName: string;
  companyName: string;
  price?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  investments?: InvestmentBreakdown;
}

export const BurgerVisualizer: React.FC<BurgerVisualizerProps> = ({
  customization,
  productName,
  companyName,
  price,
  className = '',
  size = 'md',
  investments = {
    tasteQuality: 20,
    design: 20,
    service: 20,
    priceCompetitiveness: 20,
    advertising: 20,
  },
}) => {
  const { bun, patty, toppings, sauce, packaging, adModel, adSlogan } = customization;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  // Investments levels
  const isHighTaste = investments.tasteQuality >= 35;
  const isMidTaste = investments.tasteQuality >= 20;

  const isHighDesign = investments.design >= 35;
  const isMidDesign = investments.design >= 20;

  const isHighAd = investments.advertising >= 35;
  const isMidAd = investments.advertising >= 20;

  const isHighService = investments.service >= 22;
  const isHighPrice = investments.priceCompetitiveness >= 22;

  // Bun color schemes
  const getBunColors = () => {
    switch (bun) {
      case 'brioche':
        return {
          top: 'from-amber-500 via-amber-400 to-amber-600 border-amber-700',
          bottom: 'from-amber-600 to-amber-700 border-amber-800',
          shine: 'bg-amber-200',
          label: '버터 브리오슈 번',
        };
      case 'black_squid':
        return {
          top: 'from-slate-800 via-slate-900 to-black border-black',
          bottom: 'from-slate-900 to-black border-black',
          shine: 'bg-slate-500',
          label: '오징어먹물 블랙번',
        };
      case 'sesame':
        return {
          top: 'from-amber-400 via-amber-300 to-yellow-600 border-amber-700',
          bottom: 'from-amber-500 to-yellow-700 border-amber-800',
          shine: 'bg-yellow-100',
          label: '고소한 참깨번',
        };
      default:
        return {
          top: 'from-amber-400 to-amber-500 border-amber-600',
          bottom: 'from-amber-500 to-amber-600 border-amber-700',
          shine: 'bg-amber-100',
          label: '오리지널 번',
        };
    }
  };

  const getPattyDetails = () => {
    switch (patty) {
      case 'chicken':
        return {
          bg: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700',
          border: 'border-yellow-800',
          name: '크리스피 통닭다리살 패티',
          emoji: '🍗',
        };
      case 'shrimp':
        return {
          bg: 'bg-gradient-to-r from-orange-400 via-rose-400 to-orange-500',
          border: 'border-rose-600',
          name: '탱글탱글 통새우 패티',
          emoji: '🦐',
        };
      case 'vegan':
        return {
          bg: 'bg-gradient-to-r from-emerald-800 via-amber-900 to-emerald-900',
          border: 'border-emerald-950',
          name: '표고버섯 비건 패티',
          emoji: '🍄',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-stone-800 via-amber-950 to-stone-900',
          border: 'border-stone-950',
          name: '1등급 한우 쇠고기 패티',
          emoji: '🥩',
        };
    }
  };

  const bunStyle = getBunColors();
  const pattyDetails = getPattyDetails();

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      {/* 1. ADVERTISING SHOWCASE BANNER / BILLBOARD (광고 투자 반영) */}
      {!isSmall && (
        <div className="w-full mb-3 text-center transition-all">
          {isHighAd ? (
            /* High Advertising: Glowing celebrity neon banner */
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 border-2 border-white/60 animate-pulse">
              <span className="text-sm">🌟</span>
              <span>[전속모델: {adModel === 'top_idol' ? '글로벌 아이돌' : '100만 먹방스타'}]</span>
              <span className="text-pink-100 font-bold">"{adSlogan || '대세 화제작!'}"</span>
              <span className="bg-white text-rose-600 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                TV/유튜브 방영
              </span>
            </div>
          ) : isMidAd ? (
            /* Mid Advertising */
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>[홍보] "{adSlogan || '맛있는 우리 버거'}"</span>
            </div>
          ) : (
            /* Basic Ad */
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] text-slate-500 bg-slate-100 border border-slate-200">
              <span>📢 기본 홍보 포스터</span>
            </div>
          )}
        </div>
      )}

      {/* Main Stage: Burger Center + Designer Package + Service Tray items */}
      <div className={`relative flex items-center justify-center transition-all ${
        isSmall ? 'py-1' : isLarge ? 'py-4' : 'py-2'
      }`}>
        {/* DESIGN PACKAGING BOX ON THE LEFT/BACK (디자인 투자 반영) */}
        {!isSmall && isHighDesign && (
          <div className="absolute -left-3 sm:-left-6 top-3 z-0 transition-all rotate-[-10deg] animate-float opacity-95">
            <div className="w-20 sm:w-24 p-2 rounded-2xl bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 border-2 border-amber-400 shadow-xl text-center space-y-1">
              <div className="text-xs">👑</div>
              <div className="text-[10px] font-black text-amber-900 tracking-tight leading-tight">
                골드 럭셔리<br />전용 패키지
              </div>
              <div className="w-full h-1 bg-amber-400 rounded-full" />
              <div className="text-[9px] text-amber-700 font-bold">
                {companyName || 'BRAND'}
              </div>
            </div>
          </div>
        )}

        {!isSmall && !isHighDesign && isMidDesign && (
          <div className="absolute -left-2 sm:-left-4 top-4 z-0 transition-all rotate-[-8deg] opacity-90">
            <div className="w-18 p-1.5 rounded-xl bg-purple-100 border border-purple-300 shadow-md text-center space-y-0.5">
              <div className="text-xs">✨</div>
              <div className="text-[9px] font-bold text-purple-900 leading-tight">
                네온 틴케이스
              </div>
              <div className="text-[8px] text-purple-600">감성 디자인</div>
            </div>
          </div>
        )}

        {/* SERVICE / DRINK & FRIES ON THE RIGHT (서비스 투자 반영) */}
        {!isSmall && isHighService && (
          <div className="absolute -right-3 sm:-right-6 bottom-2 z-20 transition-all rotate-[8deg] animate-float">
            <div className="flex flex-col items-center gap-1 bg-white/95 p-2 rounded-2xl border-2 border-blue-300 shadow-xl">
              <div className="flex items-center gap-1">
                <span className="text-lg" title="바삭 감자튀김">🍟</span>
                <span className="text-lg" title="얼음 탄산음료">🥤</span>
              </div>
              <div className="text-[9px] font-black text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded-full">
                세트 덤 증정!
              </div>
              <div className="text-[8px] text-slate-500 font-bold flex items-center gap-0.5">
                <span>🛵 굿즈+총알배달</span>
              </div>
            </div>
          </div>
        )}

        {/* PRICE COMPETITIVENESS DISCOUNT STAMP ON TOP RIGHT (가격 경쟁력 반영) */}
        {!isSmall && isHighPrice && (
          <div className="absolute right-0 -top-2 z-35 rotate-12 transition-all">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-lg border-2 border-white flex items-center gap-1 animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>학생 1+1 반값할인!</span>
            </div>
          </div>
        )}

        {/* THE HAMBURGER ITSELF (맛·품질 투자에 따라 크기, 패티, 치즈, 토핑이 극적으로 변화) */}
        <div className={`relative flex flex-col items-center justify-center transition-all z-10 ${
          isSmall ? 'w-24 scale-90' : isLarge ? 'w-56' : 'w-44'
        }`}>
          {/* Steam / Fresh Gourmet sparkles if High Taste */}
          {isHighTaste && !isSmall && (
            <div className="absolute -top-6 flex items-center gap-1 text-xs font-bold text-amber-500 animate-pulse">
              <span>♨️</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full border border-amber-300 font-extrabold shadow-xs">
                육즙 2배 1등급 한우!
              </span>
              <span>♨️</span>
            </div>
          )}

          {/* Top Bun */}
          <div className={`relative rounded-t-full shadow-lg border-b-2 flex items-center justify-center z-30 transition-all bg-gradient-to-b ${bunStyle.top} ${bunStyle.top.split(' ').pop()} ${
            isSmall ? 'w-20 h-7' : isLarge ? 'w-44 h-16' : 'w-36 h-13'
          }`}>
            {/* Bun shine */}
            <div className={`absolute top-1 left-4 rounded-full opacity-70 ${bunStyle.shine} ${
              isSmall ? 'w-5 h-1' : isLarge ? 'w-12 h-2.5' : 'w-8 h-2'
            }`} />

            {/* Sesame seeds if sesame bun */}
            {bun === 'sesame' && (
              <div className="absolute inset-0 flex flex-wrap justify-around items-center px-4 pt-1 opacity-90">
                <span className="text-[10px] text-amber-100 rotate-12">▫</span>
                <span className="text-[9px] text-amber-100 -rotate-45">▫</span>
                <span className="text-[10px] text-amber-100 rotate-45">▫</span>
                <span className="text-[9px] text-amber-100 -rotate-12">▫</span>
              </div>
            )}
          </div>

          {/* Sauce Layer */}
          <div className={`z-26 -mt-1 rounded-full shadow-inner flex items-center justify-center bg-rose-600/90 ${
            isSmall ? 'w-18 h-1.5' : isLarge ? 'w-40 h-3' : 'w-32 h-2.5'
          }`} title={`특제 소스: ${sauce}`} />

          {/* Bacon strips if High Taste */}
          {isHighTaste && (
            <div className={`z-24 -mt-1 flex justify-around bg-gradient-to-r from-rose-700 via-red-800 to-rose-700 rounded-sm shadow-sm border border-red-900 ${
              isSmall ? 'w-18 h-1.5' : isLarge ? 'w-42 h-3.5' : 'w-34 h-2.5'
            }`} title="바삭 크리스피 베이컨" />
          )}

          {/* Melted Cheese (Drooping cheese drip effect if High Taste) */}
          {(toppings.includes('cheese') || isMidTaste) && (
            <div className={`z-22 -mt-1 bg-amber-400 rotate-2 border-b-2 border-amber-500 shadow-md rounded-sm ${
              isSmall ? 'w-20 h-2' : isLarge ? 'w-44 h-5' : 'w-36 h-4'
            }`} title="체다 치즈">
              <div className="w-full h-full flex justify-between px-2">
                <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -mb-1 shadow-xs" />
                <div className="w-3 h-3 bg-amber-400 rotate-45 -mb-1 shadow-xs" />
                <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -mb-1 shadow-xs" />
              </div>
            </div>
          )}

          {/* Fresh Lettuce & Juicy Tomatoes */}
          <div className={`z-20 -mt-1 flex items-center justify-between ${
            isSmall ? 'w-20 h-3' : isLarge ? 'w-44 h-6' : 'w-36 h-5'
          }`} title="양상추 & 싱싱 토마토">
            {/* Tomato */}
            <div className="bg-red-500 h-full w-1/3 rounded-sm border-b-2 border-red-700 shadow-sm" />
            {/* Wavy fresh lettuce */}
            <div className="bg-emerald-500 h-full w-2/3 rounded-full border-b-2 border-emerald-700 shadow-sm flex items-center justify-around px-1">
              <span className="text-emerald-200 text-[10px]">~</span>
              <span className="text-emerald-200 text-[10px]">~</span>
              <span className="text-emerald-200 text-[10px]">~</span>
            </div>
          </div>

          {/* Onion Rings & Pickles if Taste >= 20 */}
          {isMidTaste && (
            <div className={`z-18 -mt-1 flex justify-around bg-slate-100/95 rounded-full border border-slate-300 shadow-xs ${
              isSmall ? 'w-18 h-1.5' : isLarge ? 'w-40 h-2.5' : 'w-32 h-2'
            }`} title="달콤 구운 양파링 & 피클" />
          )}

          {/* MAIN PATTY 1 */}
          <div className={`z-15 -mt-1 rounded-xl shadow-lg border-b-2 flex items-center justify-between px-2.5 ${pattyDetails.bg} ${pattyDetails.border} ${
            isSmall ? 'w-22 h-4' : isLarge ? 'w-48 h-8' : 'w-38 h-7'
          }`} title={pattyDetails.name}>
            <span className="text-xs">{pattyDetails.emoji}</span>
            {!isSmall && (
              <span className="text-[10px] font-bold text-amber-100 tracking-wider drop-shadow">
                {pattyDetails.name.split(' ')[0]}
              </span>
            )}
            <span className="text-xs">{pattyDetails.emoji}</span>
          </div>

          {/* EXTRA DOUBLE PATTY IF HIGH TASTE QUALITY (맛 투자 35만 원 이상 시 더블 패티!) */}
          {isHighTaste && (
            <div className={`z-12 -mt-1 rounded-xl shadow-lg border-b-2 flex items-center justify-between px-2.5 ${pattyDetails.bg} ${pattyDetails.border} ${
              isSmall ? 'w-22 h-3.5' : isLarge ? 'w-48 h-7.5' : 'w-38 h-6.5'
            }`} title="추가 프리미엄 패티 (더블 패티!)">
              <span className="text-[10px]">⭐</span>
              <span className="text-[9px] font-black text-amber-200 drop-shadow">
                + 추가 더블 패티 (육즙 2배)
              </span>
              <span className="text-[10px]">⭐</span>
            </div>
          )}

          {/* Bottom Bun */}
          <div className={`z-5 -mt-1 rounded-b-2xl shadow-md border-t border-amber-900/30 bg-gradient-to-b ${bunStyle.bottom} ${bunStyle.bottom.split(' ').pop()} ${
            isSmall ? 'w-20 h-4' : isLarge ? 'w-42 h-9' : 'w-34 h-7'
          }`} />
        </div>
      </div>

      {/* 3. STORE MENU CARD FOOTER (제품명, 회사명, 가격, 투자 뱃지) */}
      {!isSmall && (
        <div className="mt-3 text-center w-full space-y-1.5">
          {/* Dynamic Badges based on 5 Investments */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {isHighTaste && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-amber-100 text-amber-900 border-amber-300 shadow-2xs">
                🥩 맛·품질 집중 (육즙더블)
              </span>
            )}
            {isHighDesign && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-purple-100 text-purple-900 border-purple-300 shadow-2xs">
                🎨 명품 디자인 패키지
              </span>
            )}
            {isHighAd && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-pink-100 text-pink-900 border-pink-300 shadow-2xs">
                📢 스타 마케팅 화제작
              </span>
            )}
            {isHighService && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-blue-100 text-blue-900 border-blue-300 shadow-2xs">
                🛵 무료배달·감튀세트
              </span>
            )}
            {isHighPrice && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs">
                🏷️ 학생 1+1 반값할인
              </span>
            )}
          </div>

          <h4 className="font-jua text-lg sm:text-xl text-slate-900 tracking-tight leading-snug">
            {productName || '우리 모둠 특제 버거'}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {companyName || '우리 회사'}
          </p>

          {price && (
            <div className="mt-1 font-bold text-lg sm:text-xl text-amber-600 font-jua">
              {price.toLocaleString()}원
            </div>
          )}
        </div>
      )}
    </div>
  );
};
