import React, { useState } from 'react';
import { Company, PurchaseReview, ConsumerState } from '../types';
import { BurgerVisualizer } from './BurgerVisualizer';
import {
  ShoppingBag,
  Star,
  Coins,
  Receipt,
  Heart,
  Sparkles,
  Award,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConsumerMarketProps {
  companies: Company[];
  consumerState: ConsumerState;
  onRecordPurchase: (review: PurchaseReview) => void;
  onUpdateBudget: (newBudget: number) => void;
  onUpdateConsumerName: (name: string) => void;
  allReviews: PurchaseReview[];
}

export const ConsumerMarket: React.FC<ConsumerMarketProps> = ({
  companies,
  consumerState,
  onRecordPurchase,
  onUpdateBudget,
  onUpdateConsumerName,
  allReviews,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [primaryReason, setPrimaryReason] = useState<'taste' | 'price' | 'design' | 'service' | 'advertising'>('taste');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'taste' | 'price' | 'design' | 'ad'>('all');
  const [lastReceipt, setLastReceipt] = useState<PurchaseReview | null>(null);
  const [showReceiptHistory, setShowReceiptHistory] = useState<boolean>(false);

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'taste') return company.investments.tasteQuality >= 30;
    if (activeFilter === 'price') return company.price <= 5500 || company.investments.priceCompetitiveness >= 30;
    if (activeFilter === 'design') return company.investments.design >= 25;
    if (activeFilter === 'ad') return company.investments.advertising >= 25;
    return true;
  });

  const handleOpenBuyModal = (company: Company) => {
    setSelectedCompany(company);
    setPurchaseQuantity(1);
    setRating(5);
    setComment('');
  };

  const handleConfirmPurchase = () => {
    if (!selectedCompany) return;

    const totalCost = selectedCompany.price * purchaseQuantity;
    if (consumerState.budget < totalCost) {
      alert(`용돈이 부족합니다! (현재 잔액: ${consumerState.budget.toLocaleString()}원, 필요 금액: ${totalCost.toLocaleString()}원)`);
      return;
    }

    const newReview: PurchaseReview = {
      id: `review-${Date.now()}`,
      companyId: selectedCompany.id,
      consumerName: consumerState.name || '알뜰 학생 소비자',
      quantity: purchaseQuantity,
      totalPaid: totalCost,
      primaryReason,
      rating,
      comment: comment.trim() || '친구들과 함께 맛있게 먹었습니다!',
      timestamp: Date.now(),
    };

    onRecordPurchase(newReview);
    onUpdateBudget(consumerState.budget - totalCost);
    setLastReceipt(newReview);
    setSelectedCompany(null);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Consumer Profile & Wallet Bar */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/15 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>소비자 시장 탐방 및 합리적 선택 체험</span>
            </div>
            <h2 className="font-jua text-2xl sm:text-3xl tracking-tight">
              소비자의 마음을 잡아라! 햄버거 마켓
            </h2>
            <p className="mt-1 text-sm sm:text-base text-rose-100 max-w-2xl">
              어떤 회사의 햄버거가 가장 매력적인가요? 맛, 가격, 디자인, 서비스, 광고를 꼼꼼히 비교해 보고 주어진 용돈으로 현명한 선택을 해보세요!
            </p>
          </div>

          {/* Consumer Wallet Box */}
          <div className="bg-white/95 text-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg border border-rose-200 flex flex-col gap-3 min-w-[260px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500">내 소비자 프로필</span>
              <button
                type="button"
                onClick={() => setShowReceiptHistory(!showReceiptHistory)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                가계부 ({consumerState.purchases.length}건)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">이름:</span>
              <input
                type="text"
                value={consumerState.name}
                onChange={e => onUpdateConsumerName(e.target.value)}
                placeholder="소비자 이름 (예: 6학년 지민이)"
                className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 focus:outline-rose-500 flex-1"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                <Coins className="w-4 h-4" />
                <span>남은 용돈:</span>
              </div>
              <span className="font-jua text-2xl text-rose-600">
                {consumerState.budget.toLocaleString()}원
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => onUpdateBudget(consumerState.budget + 10000)}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                +1만원 용돈 충전
              </button>
              <button
                type="button"
                onClick={() => onUpdateBudget(30000)}
                className="hover:underline cursor-pointer"
              >
                30,000원으로 리셋
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-rose-100 mr-1">🔍 관심 분야별 버거 모아보기:</span>
          {[
            { id: 'all', label: '전체 버거 매장' },
            { id: 'taste', label: '🥩 맛·품질 집중 버거' },
            { id: 'price', label: '🏷️ 가성비 착한가격 버거' },
            { id: 'design', label: '🎨 감성 디자인 버거' },
            { id: 'ad', label: '📢 인기 스타/광고 버거' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* If receipt history opened */}
      {showReceiptHistory && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600" />
              <h3 className="font-jua text-lg text-slate-900">
                내 소비 가계부 & 구매 영수증 모음
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              총 {consumerState.purchases.length}회 구매
            </span>
          </div>

          {consumerState.purchases.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-400 font-medium">
              아직 구매한 내역이 없습니다. 마켓에서 마음에 드는 햄버거를 골라보세요!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {consumerState.purchases.map((p, idx) => {
                const targetCompany = companies.find(c => c.id === p.companyId);
                return (
                  <div key={p.id || idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">
                        {targetCompany?.companyName || '햄버거 매장'}
                      </span>
                      <span className="font-jua text-rose-600">
                        -{p.totalPaid.toLocaleString()}원
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {targetCompany?.productName || '제품'} ({p.quantity}개)
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {'★'.repeat(p.rating)}
                      <span className="text-slate-400 text-[10px] ml-1">
                        "{p.comment}"
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Market Stores Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium text-base">
            등록된 햄버거 회사가 없습니다. '1. 우리 회사 투자하기' 탭에서 모둠 햄버거를 먼저 등록해주세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCompanies.map(company => {
            // Count total reviews and avg rating for this company
            const reviewsForCompany = allReviews.filter(r => r.companyId === company.id);
            const avgRating = reviewsForCompany.length > 0
              ? (reviewsForCompany.reduce((acc, r) => acc + r.rating, 0) / reviewsForCompany.length).toFixed(1)
              : '5.0';

            return (
              <div
                key={company.id}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Store Top Banner */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-amber-50/70 to-orange-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-white shadow-2xs">
                      {company.groupNum}모둠 매장
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{avgRating}</span>
                      <span className="text-slate-400 text-[10px]">({reviewsForCompany.length}명 평가)</span>
                    </div>
                  </div>

                  <h3 className="font-jua text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                    {company.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    개발자: {company.studentNames} ({company.grade}학년 {company.classNum}반)
                  </p>
                </div>

                {/* Burger Visual Center */}
                <div className="p-5 flex flex-col items-center justify-center bg-radial from-amber-50/40 to-transparent">
                  <BurgerVisualizer
                    customization={company.customization}
                    productName={company.productName}
                    companyName={company.companyName}
                    price={company.price}
                    size="md"
                    investments={company.investments}
                  />
                </div>

                {/* Company 100M Investment Breakdown Bars */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>📊 100만 원 투자 비중</span>
                    <span className="text-amber-600 font-jua">
                      {company.investments[company.mainFocus]}만 원 집중!
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                    <div className="bg-amber-100 text-amber-900 p-1 rounded-md" title={`맛·품질: ${company.investments.tasteQuality}만원`}>
                      <span className="block font-bold">맛</span>
                      <span>{company.investments.tasteQuality}만</span>
                    </div>
                    <div className="bg-purple-100 text-purple-900 p-1 rounded-md" title={`디자인: ${company.investments.design}만원`}>
                      <span className="block font-bold">디자인</span>
                      <span>{company.investments.design}만</span>
                    </div>
                    <div className="bg-blue-100 text-blue-900 p-1 rounded-md" title={`서비스: ${company.investments.service}만원`}>
                      <span className="block font-bold">서비스</span>
                      <span>{company.investments.service}만</span>
                    </div>
                    <div className="bg-emerald-100 text-emerald-900 p-1 rounded-md" title={`가격할인: ${company.investments.priceCompetitiveness}만원`}>
                      <span className="block font-bold">가격할인</span>
                      <span>{company.investments.priceCompetitiveness}만</span>
                    </div>
                    <div className="bg-rose-100 text-rose-900 p-1 rounded-md" title={`광고홍보: ${company.investments.advertising}만원`}>
                      <span className="block font-bold">광고</span>
                      <span>{company.investments.advertising}만</span>
                    </div>
                  </div>

                  {/* Company strategic reason highlight */}
                  {company.reasons.mainFocusReason && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 bg-white p-2 rounded-lg border border-slate-200/80 mt-1">
                      🗣️ "{company.reasons.mainFocusReason}"
                    </p>
                  )}
                </div>

                {/* Pricing & Buy Button Bottom Bar */}
                <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">판매 가격</span>
                    <span className="font-jua text-xl sm:text-2xl text-slate-900">
                      {company.price.toLocaleString()}원
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBuyModal(company)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>구매하기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buy Interaction Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase">
                  [ {selectedCompany.companyName} ] 제품 주문서
                </span>
                <h3 className="font-jua text-2xl text-slate-900">
                  {selectedCompany.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quantity and Price Calculation */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">단품 가격:</span>
                <span className="font-jua text-lg text-slate-900">
                  {selectedCompany.price.toLocaleString()}원
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">구매 수량:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-jua text-lg w-8 text-center">{purchaseQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(Math.min(5, purchaseQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-800">총 결제 금액:</span>
                <span className="font-jua text-2xl text-rose-600">
                  {(selectedCompany.price * purchaseQuantity).toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Primary Choice Reason (Core Economic Learning Question!) */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                ❓ 내가 이 햄버거를 선택한 가장 결정적인 이유는? (합리적 소비 질문)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'taste', icon: '🥩', label: '뛰어난 맛 & 신선한 좋은 재료' },
                  { key: 'price', icon: '🏷️', label: '부담 없는 착한 가격 (가성비)' },
                  { key: 'design', icon: '🎨', label: '예쁜 포장 패키지 & 비주얼' },
                  { key: 'service', icon: '🛵', label: '친절한 쿠폰/굿즈 서비스 혜택' },
                  { key: 'advertising', icon: '📢', label: '시선을 끄는 광고 문구 & 모델' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPrimaryReason(item.key as any)}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      primaryReason === item.key
                        ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Stars & Comment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900">
                  ⭐ 소비자 만족도 평가 (별점):
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer text-xl"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="기업 모둠 친구들에게 남길 솔직한 한 줄 구매 후기를 적어보세요! (예: 가성비 짱이에요, 패티가 정말 부드러워요!)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-rose-500 shadow-2xs"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-600 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>결제하고 영수증 받기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal Popup when purchase done */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-2 border-dashed border-slate-300 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-jua text-2xl text-slate-900">
              구매가 완료되었습니다!
            </h3>
            <p className="text-xs text-slate-500">
              우리 교실 햄버거 마켓의 소중한 영수증이 발급되었습니다.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">구매자:</span>
                <span className="font-bold">{lastReceipt.consumerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">수량:</span>
                <span className="font-bold">{lastReceipt.quantity}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">결제 금액:</span>
                <span className="font-jua text-rose-600 text-base">
                  {lastReceipt.totalPaid.toLocaleString()}원
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                ⭐ 한줄평: "{lastReceipt.comment}"
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLastReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer hover:bg-slate-800 transition-colors"
            >
              확인 (계속 쇼핑하기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
