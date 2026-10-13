import React, { useState } from 'react';
import { Company, PurchaseReview, SimulationResult } from '../types';
import { runClassroomMarketSimulation } from '../utils/marketSimulation';
import {
  Trophy,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  PieChart,
  MessageSquare,
  Bot,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveDashboardProps {
  companies: Company[];
  allReviews: PurchaseReview[];
  onAddReviews: (newReviews: PurchaseReview[]) => void;
  onClearSimulations: () => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  companies,
  allReviews,
  onAddReviews,
  onClearSimulations,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCount, setSimulationCount] = useState<number>(60);
  const [lastSimulationSummary, setLastSimulationSummary] = useState<SimulationResult | null>(null);
  const [selectedAward, setSelectedAward] = useState<{
    title: string;
    badge: string;
    company: Company;
    detail: string;
  } | null>(null);

  // Gemini AI Economist Commentary state
  const [aiReport, setAiReport] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Calculate stats per company
  const companyStats = companies.map(company => {
    const reviews = allReviews.filter(r => r.companyId === company.id);
    const totalSalesUnits = reviews.reduce((sum, r) => sum + r.quantity, 0);
    const totalRevenue = totalSalesUnits * company.price;
    const initialInvestment = 1000000; // 100만원 투자금
    const totalManufacturingCost = totalSalesUnits * company.costPerUnit;
    const totalCost = initialInvestment + totalManufacturingCost;
    const netProfit = totalRevenue - totalCost;

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
      : 0;

    return {
      company,
      reviewsCount: reviews.length,
      totalSalesUnits,
      totalRevenue,
      totalCost,
      initialInvestment,
      netProfit,
      avgRating,
      profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0',
    };
  });

  const totalMarketUnits = companyStats.reduce((sum, s) => sum + s.totalSalesUnits, 0);
  const totalMarketRevenue = companyStats.reduce((sum, s) => sum + s.totalRevenue, 0);

  // Determine award winners
  const bestSeller = [...companyStats].sort((a, b) => b.totalSalesUnits - a.totalSalesUnits)[0];
  const highestProfit = [...companyStats].sort((a, b) => b.netProfit - a.netProfit)[0];
  const topRated = [...companyStats].filter(s => s.reviewsCount > 0).sort((a, b) => b.avgRating - a.avgRating)[0];

  const handleRunSimulation = (count: number) => {
    if (companies.length === 0) {
      alert('먼저 햄버거 회사를 1개 이상 등록해주세요!');
      return;
    }

    setIsSimulating(true);
    setTimeout(() => {
      const result = runClassroomMarketSimulation(companies, count);
      setLastSimulationSummary(result);
      onAddReviews(result.generatedReviews);
      setIsSimulating(false);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // safe fallback
      }
    }, 800);
  };

  const handleOpenAwardModal = (title: string, badge: string, company: Company, detail: string) => {
    setSelectedAward({ title, badge, company, detail });
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // safe
    }
  };

  const handleGenerateAiReport = async () => {
    setIsAiLoading(true);

    try {
      // Prompt construction for elementary 6th grade economics lesson
      const summaryData = companyStats.map(s => (
        `- [${s.company.groupNum}모둠] ${s.company.companyName} (${s.company.productName}): 판매가 ${s.company.price.toLocaleString()}원, 주요투자: ${s.company.mainFocus} (${s.company.investments[s.company.mainFocus]}만원), 총판매량 ${s.totalSalesUnits}개, 매출액 ${s.totalRevenue.toLocaleString()}원, 순이익 ${s.netProfit.toLocaleString()}원, 만족도 평점 ${s.avgRating.toFixed(1)}점`
      )).join('\n');

      const promptText = `초등학교 6학년 경제 수업 '우리 회사의 선택! 소비자의 마음을 잡아라!' 모둠별 시장 결과 리포트입니다.
학생들이 100만 원의 투자 비용을 맛, 디자인, 서비스, 가격, 광고에 분배하고 최종 햄버거를 판매한 결과입니다.

[각 모둠별 시장 결과]
${summaryData}

초등학교 6학년 학생들에게 격려와 칭찬을 보내고, 경제학적 관점에서:
1. 각 모둠의 전략적 강점 칭찬 (가성비, 품질, 브랜딩 등)
2. '순이익(매출 - 투자비용 - 원가)'과 '가격 책정'의 상관관계에 대한 친절한 설명
3. 100만원이라는 한정된 자원을 배분할 때 겪은 '기회비용'과 '합리적 의사결정'에 대한 총평
위 내용을 친근하고 흥미로운 선생님 말투(~했답니다!, 대단해요!)로 3~4문단으로 작성해 주세요.`;

      // Call server proxy or client fallback
      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiReport(data.text);
      } else {
        // Fallback smart rule-based report
        generateSmartLocalReport();
      }
    } catch (e) {
      generateSmartLocalReport();
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateSmartLocalReport = () => {
    if (!bestSeller || !highestProfit) return;
    const report = `🎉 **6학년 경제 탐험대 여러분, 시장 운영을 정말 훌륭하게 완주했습니다!**

오늘 시장에서는 다양한 전략이 빛을 발했습니다. 가장 많은 소비자들의 발걸음을 이끈 기업은 **[${bestSeller.company.groupNum}모둠] ${bestSeller.company.companyName}**(총 ${bestSeller.totalSalesUnits}개 판매)이었으며, 비용을 효율적으로 관리하여 최고 순이익을 거둔 기업은 **[${highestProfit.company.groupNum}모둠] ${highestProfit.company.companyName}**(순이익 ${highestProfit.netProfit.toLocaleString()}원)이었습니다!

💡 **선생님이 전하는 경제 인사이트:**
1. **이윤의 비밀:** 단순히 제품을 많이 판다고 해서 항상 가장 큰 이윤이 남는 것은 아니라는 점을 배웠습니다. 100만 원의 투자금과 재료 원가를 고려하여 적절한 판매 가격을 매기는 것이 기업에게 얼마나 중요한지 확인했지요?
2. **소비자의 다양한 취향:** 어떤 친구는 착한 가격에 끌리고, 어떤 친구는 육즙 가득한 맛에, 또 어떤 친구는 멋진 포장 디자인과 아이돌 광고에 지갑을 열었습니다. 기업은 이렇게 다양한 소비자의 마음을 읽어야 성공할 수 있습니다.
3. **기회비용의 교훈:** 100만 원이라는 한정된 자원 때문에 모든 분야에 다 쏟아부을 수 없었던 '선택과 포기(기회비용)'의 순간을 모둠 친구들과 멋지게 협의해 낸 여러분 모두가 오늘의 훌륭한 어린이 경제학자입니다!`;
    setAiReport(report);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Classroom Projector Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>교실 전자칠판 & 빔프로젝터 공개수업 전광판</span>
            </div>
            <h2 className="font-jua text-2xl sm:text-3xl tracking-tight">
              📊 우리 반 햄버거 시장 실시간 결산 전광판
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-300 max-w-2xl">
              어떤 모둠의 버거가 가장 많이 팔렸을까요? 100만 원의 투자금을 가장 슬기롭게 사용하여 최고 순이익을 달성한 모둠을 확인해 봅시다!
            </p>
          </div>

          {/* Quick Simulation Trigger Bar */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-indigo-500/30 flex flex-col gap-2.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              가상 소비자 시장 시뮬레이션
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(50)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>소비자 50명 투입</span>
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(100)}
                className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>소비자 100명 투입</span>
              </button>
            </div>
            {lastSimulationSummary && (
              <span className="text-[11px] text-emerald-400 font-medium">
                ✓ 최근 {lastSimulationSummary.totalSimulatedConsumers}명 시뮬레이션 완료!
              </span>
            )}
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/80">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block font-semibold">총 햄버거 판매량</span>
            <span className="font-jua text-2xl sm:text-3xl text-amber-400">
              {totalMarketUnits.toLocaleString()}개
            </span>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block font-semibold">총 시장 매출액</span>
            <span className="font-jua text-2xl sm:text-3xl text-emerald-400">
              {totalMarketRevenue.toLocaleString()}원
            </span>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block font-semibold">참여 기업 (모둠)</span>
            <span className="font-jua text-2xl sm:text-3xl text-white">
              {companies.length}개 팀
            </span>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block font-semibold">소비자 구매 평가</span>
            <span className="font-jua text-2xl sm:text-3xl text-rose-400">
              {allReviews.length}건
            </span>
          </div>
        </div>
      </div>

      {/* Awards Ceremony Section (공개수업 시상식) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="font-jua text-xl sm:text-2xl text-slate-900">
              🏆 우리 반 영예의 경제 시상식
            </h3>
          </div>
          <span className="text-xs text-slate-500">카드를 클릭하면 축하 상장이 수여됩니다!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Best Seller Award */}
          {bestSeller && (
            <div
              onClick={() => handleOpenAwardModal(
                '소비자의 마음을 훔친 베스트셀러 대상',
                '🥇 최다 판매 1위',
                bestSeller.company,
                `총 ${bestSeller.totalSalesUnits}개의 햄버거를 판매하여 시장에서 가장 뜨거운 인기를 누렸습니다!`
              )}
              className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white">
                  최다 판매상 🥇
                </span>
                <span className="text-2xl">🍔</span>
              </div>
              <h4 className="font-jua text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                {bestSeller.company.companyName}
              </h4>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                {bestSeller.company.groupNum}모둠 ({bestSeller.company.studentNames})
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-between items-center text-sm">
                <span className="text-slate-500">누적 판매량</span>
                <span className="font-jua text-xl text-amber-600">
                  {bestSeller.totalSalesUnits}개
                </span>
              </div>
            </div>
          )}

          {/* Highest Net Profit Award */}
          {highestProfit && (
            <div
              onClick={() => handleOpenAwardModal(
                '알짜배기 최고 이윤 경제마스터상',
                '💰 최고 순이익 1위',
                highestProfit.company,
                `100만 원 투자금과 제조 원가를 빼고도 ${highestProfit.netProfit.toLocaleString()}원의 압도적인 순이익을 달성했습니다!`
              )}
              className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white">
                  최고 순이익상 💰
                </span>
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-jua text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                {highestProfit.company.companyName}
              </h4>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                {highestProfit.company.groupNum}모둠 ({highestProfit.company.studentNames})
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex justify-between items-center text-sm">
                <span className="text-slate-500">최종 순이익</span>
                <span className={`font-jua text-xl ${
                  highestProfit.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {highestProfit.netProfit > 0 ? '+' : ''}{highestProfit.netProfit.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          {/* Top Rated Consumer Satisfaction Award */}
          {topRated && (
            <div
              onClick={() => handleOpenAwardModal(
                '소비자 만족도 최고 감동 대상',
                '⭐ 평점 1위',
                topRated.company,
                `소비자 만족도 평균 ${topRated.avgRating.toFixed(1)}점 (만점 5.0)을 기록하여 최고의 호평을 받았습니다!`
              )}
              className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 hover:border-rose-400 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white">
                  소비자 감동상 ⭐
                </span>
                <span className="text-2xl">💖</span>
              </div>
              <h4 className="font-jua text-xl text-slate-900 group-hover:text-rose-600 transition-colors">
                {topRated.company.companyName}
              </h4>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                {topRated.company.groupNum}모둠 ({topRated.company.studentNames})
              </p>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex justify-between items-center text-sm">
                <span className="text-slate-500">평균 만족도</span>
                <span className="font-jua text-xl text-rose-600">
                  ★ {topRated.avgRating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Economics Ledger Table (핵심 경제 결산표) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-jua text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
              <span>📈 모둠별 상세 경제 결산표</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                수익 = 매출액 - 투자비용(100만) - 재료원가
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              투자와 가격 책정이 기업의 순이익에 어떤 영향을 미치는지 한눈에 비교해 보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClearSimulations}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            판매 데이터 리셋
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">모둠 / 기업명</th>
                <th className="p-4">제품명</th>
                <th className="p-4 text-right">판매 가격</th>
                <th className="p-4 text-center">판매량</th>
                <th className="p-4 text-right">총 매출액</th>
                <th className="p-4 text-right">투자금 + 원가</th>
                <th className="p-4 text-right">최종 순이익</th>
                <th className="p-4 text-center">평점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {companyStats.map((stat, idx) => {
                const isProfitable = stat.netProfit > 0;
                return (
                  <tr key={stat.company.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {stat.company.groupNum}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{stat.company.companyName}</div>
                          <div className="text-[11px] text-slate-500">{stat.company.studentNames}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-semibold">{stat.company.productName}</div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        최대투자: {stat.company.investments[stat.company.mainFocus]}만원 ({stat.company.mainFocus})
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">
                      {stat.company.price.toLocaleString()}원
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 font-jua text-base text-slate-900">
                        {stat.totalSalesUnits}개
                      </span>
                    </td>
                    <td className="p-4 text-right font-jua text-base text-slate-900">
                      {stat.totalRevenue.toLocaleString()}원
                    </td>
                    <td className="p-4 text-right text-xs text-slate-500">
                      <div>100만 원 (투자)</div>
                      <div>+ {(stat.company.costPerUnit * stat.totalSalesUnits).toLocaleString()}원 (원가)</div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-jua text-lg px-2.5 py-1 rounded-xl ${
                        isProfitable
                          ? 'bg-emerald-100 text-emerald-800'
                          : stat.netProfit === 0
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isProfitable ? '+' : ''}{stat.netProfit.toLocaleString()}원
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                        <span>★</span>
                        <span>{stat.avgRating > 0 ? stat.avgRating.toFixed(1) : '-'}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classroom Economics Teacher AI Report & Discussion Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-jua text-xl text-slate-900">
                AI 경제 멘토의 공개수업 종합 분석 리포트
              </h3>
              <p className="text-xs text-slate-500">
                수업 마무리를 위한 모둠별 강점 칭찬 및 경제 원리 총평
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isAiLoading}
            onClick={handleGenerateAiReport}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{aiReport ? '리포트 다시 생성하기' : 'AI 경제 분석 리포트 받기'}</span>
          </button>
        </div>

        {aiReport ? (
          <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-2xs whitespace-pre-line text-sm text-slate-800 leading-relaxed">
            {aiReport}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm">
            위 버튼을 누르면 우리 반 시장 결과를 종합 분석한 친절한 수업 정리 리포트가 생성됩니다!
          </div>
        )}

        {/* Discussion questions for the classroom */}
        <div className="bg-white/80 p-5 rounded-2xl border border-indigo-200/60 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>선생님과 함께 나누는 공개수업 마무리 토의 질문</span>
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <li className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <strong>1. 가격과 판매량의 관계:</strong> 가격을 낮췄을 때 판매량이 늘어났나요? 그렇다면 무조건 가격을 낮추는 것이 가장 많은 이윤을 남길까요?
            </li>
            <li className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <strong>2. 광고와 디자인의 힘:</strong> 좋은 맛뿐만 아니라 사람들에게 알리는 홍보(광고)와 매력적인 포장(디자인)은 소비자의 마음에 어떤 영향을 미쳤나요?
            </li>
            <li className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <strong>3. 기회비용과 선택:</strong> 100만 원이라는 제한된 예산 안에서 우리 모둠이 가장 포기하기 힘들었던 것은 무엇이었고, 왜 그런 결정을 내렸나요?
            </li>
            <li className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <strong>4. 소비자의 지혜:</strong> 소비자가 되어 햄버거를 살 때 단순히 유행이나 광고만 보지 않고 품질과 가격을 꼼꼼히 따지는 '합리적 소비'를 했나요?
            </li>
          </ul>
        </div>
      </div>

      {/* Award Certificate Modal */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-amber-50 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border-4 border-amber-300 relative animate-in zoom-in-95">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold hover:bg-amber-300 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-20 h-20 rounded-full bg-amber-400 text-white mx-auto flex items-center justify-center shadow-lg text-4xl">
              🏆
            </div>

            <div>
              <span className="text-xs font-black tracking-widest text-amber-700 uppercase">
                {selectedAward.badge}
              </span>
              <h3 className="font-jua text-2xl sm:text-3xl text-slate-900 mt-1">
                {selectedAward.title}
              </h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 text-slate-800 space-y-2">
              <div className="font-jua text-xl text-amber-600">
                [ {selectedAward.company.groupNum}모둠: {selectedAward.company.companyName} ]
              </div>
              <div className="text-xs text-slate-500 font-bold">
                수상자: {selectedAward.company.studentNames} ({selectedAward.company.grade}학년 {selectedAward.company.classNum}반)
              </div>
              <p className="text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100 leading-relaxed">
                {selectedAward.detail}
              </p>
            </div>

            <p className="text-xs text-amber-800 font-semibold">
              위 모둠은 6학년 경제 시장 활동에서 창의적인 전략과 협동심으로 뛰어난 성과를 거두었으므로 이 상장을 수여합니다.
            </p>

            <button
              type="button"
              onClick={() => setSelectedAward(null)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-colors shadow-md cursor-pointer"
            >
              모두 박수 치며 축하하기! 👏
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
