import React from 'react';
import {
  Building2,
  ShoppingBag,
  BarChart3,
  Printer,
  BookOpen,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'company' | 'market' | 'dashboard';
  setActiveTab: (tab: 'company' | 'market' | 'dashboard') => void;
  onOpenWorksheet: () => void;
  onOpenEconomicsGuide: () => void;
  onResetData: () => void;
  companyCount: number;
  totalSalesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenWorksheet,
  onOpenEconomicsGuide,
  onResetData,
  companyCount,
  totalSalesCount,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Subject Info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 rotate-1">
              <span className="text-2xl">🍔</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-md border border-amber-300/60">
                  초등 6학년 경제 공개수업
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <TrendingUp className="w-3 h-3" />
                  실시간 마켓 운영중
                </span>
              </div>
              <h1 className="font-jua text-lg sm:text-2xl text-slate-900 tracking-tight flex items-center gap-1.5">
                우리 회사의 선택! <span className="text-amber-600">소비자의 마음을 잡아라!</span>
              </h1>
            </div>
          </div>

          {/* Quick Action Badges / Helper Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenEconomicsGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              경제 개념 쏙쏙
            </button>
            <button
              onClick={onOpenWorksheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              활동지 인쇄 (양식)
            </button>
            <button
              onClick={onResetData}
              title="데이터 초기화 & 예시 데이터 다시 불러오기"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              초기화
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between pb-2.5 pt-1 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('company')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'company'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'bg-stone-100 text-stone-700 hover:bg-amber-100/70 hover:text-amber-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. 우리 회사 투자하기 (기업)</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'company' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {companyCount}팀 등록
              </span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'market'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-[1.02]'
                  : 'bg-stone-100 text-stone-700 hover:bg-rose-100/70 hover:text-rose-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>2. 햄버거 마켓 쇼핑 (소비자)</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'market' ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                구매 {totalSalesCount}건
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-stone-100 text-stone-700 hover:bg-indigo-100/70 hover:text-indigo-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>3. 교실 시장 전광판 (결과 & 시상식)</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-100">
                <Sparkles className="w-3 h-3" />
                전자칠판용
              </span>
            </button>
          </div>

          {/* Mobile view quick shortcuts */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={onOpenEconomicsGuide}
              className="p-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold"
              title="경제 개념"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenWorksheet}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
              title="활동지 인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
