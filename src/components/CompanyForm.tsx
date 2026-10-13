import React, { useState, useEffect } from 'react';
import { Company, InvestmentBreakdown, InvestmentReasons, BurgerCustomization } from '../types';
import { BurgerVisualizer } from './BurgerVisualizer';
import { deriveBurgerFromInvestments, calculateCostBreakdown } from '../utils/burgerAutoGenerator';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Coins,
  Store,
  Layers,
  ArrowRight,
  Calculator,
  Save,
  Trash2,
  Lightbulb,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface CompanyFormProps {
  companies: Company[];
  onSaveCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  selectedCompanyId?: string;
  onSelectCompany: (id: string) => void;
}

const INVESTMENT_CATEGORIES = [
  {
    key: 'tasteQuality' as keyof InvestmentBreakdown,
    title: '맛·품질',
    icon: '🥩',
    color: 'border-amber-400 bg-amber-50/60 text-amber-900',
    accentColor: 'bg-amber-500',
    description: '신상품 개발 및 좋은 품질의 제품(맛, 유기농 재료, 완성도 등)을 만들기 위해 드는 비용',
    tip: '예: 1등급 한우 패티, 유기농 토마토, 특제 소스 레시피 개발',
  },
  {
    key: 'design' as keyof InvestmentBreakdown,
    title: '디자인',
    icon: '🎨',
    color: 'border-purple-400 bg-purple-50/60 text-purple-900',
    accentColor: 'bg-purple-500',
    description: '제품 패키지(포장지), 햄버거 모양, 로고 등 제품과 브랜드를 매력적으로 보이게 하는 데 쓰는 비용',
    tip: '예: 인스타 감성 고급 포장 박스, 개성 있는 버거 모양, 예쁜 브랜드 로고',
  },
  {
    key: 'service' as keyof InvestmentBreakdown,
    title: '서비스',
    icon: '🛵',
    color: 'border-blue-400 bg-blue-50/60 text-blue-900',
    accentColor: 'bg-blue-500',
    description: '배달 및 쿠폰·굿즈, 주문의 편의성(배달 앱 사용 여부 등), 고객 응대 등에 드는 비용',
    tip: '예: 빠른 총알 배달, 친절한 키오스크 시스템, 한정판 키링·스티커 굿즈 증정',
  },
  {
    key: 'priceCompetitiveness' as keyof InvestmentBreakdown,
    title: '가격 경쟁력',
    icon: '🏷️',
    color: 'border-emerald-400 bg-emerald-50/60 text-emerald-900',
    accentColor: 'bg-emerald-500',
    description: '할인, 쿠폰, 세트 구성 등을 활용하여 소비자가 부담하기 좋은 가격을 만드는 데 드는 비용',
    tip: '예: 학생 할인 쿠폰, 1+1 이벤트, 감자튀김 무료 세트 업그레이드 지원',
  },
  {
    key: 'advertising' as keyof InvestmentBreakdown,
    title: '광고',
    icon: '📢',
    color: 'border-rose-400 bg-rose-50/60 text-rose-900',
    accentColor: 'bg-rose-500',
    description: '광고 모델, 광고 문구, 홍보 방법 등에 대한 비용',
    tip: '예: 인기 아이돌/유튜버 모델 계약, 중독성 있는 CM송, 틱톡/유튜브 챌린지 홍보',
  },
];

export const CompanyForm: React.FC<CompanyFormProps> = ({
  companies,
  onSaveCompany,
  onDeleteCompany,
  selectedCompanyId,
  onSelectCompany,
}) => {
  // Current editing state
  const [currentId, setCurrentId] = useState<string>('');
  const [grade, setGrade] = useState('6');
  const [classNum, setClassNum] = useState('1');
  const [groupNum, setGroupNum] = useState('1');
  const [studentNames, setStudentNames] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productName, setProductName] = useState('');

  const [investments, setInvestments] = useState<InvestmentBreakdown>({
    tasteQuality: 20,
    design: 20,
    service: 20,
    priceCompetitiveness: 20,
    advertising: 20,
  });

  const [reasons, setReasons] = useState<InvestmentReasons>({
    tasteQuality: '',
    design: '',
    service: '',
    priceCompetitiveness: '',
    advertising: '',
    mainFocusReason: '',
  });

  const [price, setPrice] = useState<number>(6000);

  const [customization, setCustomization] = useState<BurgerCustomization>({
    bun: 'sesame',
    patty: 'beef',
    toppings: ['cheese', 'lettuce_tomato'],
    sauce: '달콤바베큐',
    packaging: 'kraft',
    adModel: 'kid_hero',
    adSlogan: '우리가 만들고 모두가 사랑하는 특별한 햄버거!',
  });

  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(true);
  const [showEconomicsDetail, setShowEconomicsDetail] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Load selected company when changed
  useEffect(() => {
    if (selectedCompanyId) {
      const found = companies.find(c => c.id === selectedCompanyId);
      if (found) {
        setCurrentId(found.id);
        setGrade(found.grade);
        setClassNum(found.classNum);
        setGroupNum(found.groupNum);
        setStudentNames(found.studentNames);
        setCompanyName(found.companyName);
        setProductName(found.productName);
        setInvestments(found.investments);
        setReasons(found.reasons);
        setPrice(found.price);
        setCustomization(found.customization);
        // If loaded, keep existing customization
      }
    }
  }, [selectedCompanyId, companies]);

  // Total investment calculation
  const totalInvested =
    investments.tasteQuality +
    investments.design +
    investments.service +
    investments.priceCompetitiveness +
    investments.advertising;

  const remainingBudget = 100 - totalInvested;
  const isBudgetExact = totalInvested === 100;

  // Auto determine highest investment
  const highestCategory = (Object.keys(investments) as (keyof InvestmentBreakdown)[]).reduce(
    (max, key) => (investments[key] > investments[max] ? key : max),
    'tasteQuality' as keyof InvestmentBreakdown
  );

  const highestCatInfo = INVESTMENT_CATEGORIES.find(c => c.key === highestCategory);

  // Accurate Pedagogical Cost Breakdown
  const costBreakdown = calculateCostBreakdown(investments, price);
  const estimatedCostPerUnit = costBreakdown.totalCostPerUnit;
  const marginPerUnit = costBreakdown.marginPerUnit;
  const breakEvenUnits = costBreakdown.breakEvenUnits;

  const handleInvestmentChange = (key: keyof InvestmentBreakdown, val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    const nextInvestments = {
      ...investments,
      [key]: clamped,
    };
    setInvestments(nextInvestments);

    // Automatically update burger layers, packaging, and branding!
    const autoDerived = deriveBurgerFromInvestments(nextInvestments);
    setCustomization(prev => ({
      ...autoDerived,
      adSlogan: prev.adSlogan && prev.adSlogan !== '우리가 만들어 더 맛있는 햄버거!' ? prev.adSlogan : autoDerived.adSlogan,
    }));
  };

  const handleQuickAdjust = (key: keyof InvestmentBreakdown, delta: number) => {
    const current = investments[key];
    const next = Math.max(0, Math.min(100, current + delta));
    const nextInvestments = {
      ...investments,
      [key]: next,
    };
    setInvestments(nextInvestments);

    const autoDerived = deriveBurgerFromInvestments(nextInvestments);
    setCustomization(prev => ({
      ...autoDerived,
      adSlogan: prev.adSlogan && prev.adSlogan !== '우리가 만들어 더 맛있는 햄버거!' ? prev.adSlogan : autoDerived.adSlogan,
    }));
  };

  const handleToggleAutoSync = () => {
    const nextState = !isAutoSyncEnabled;
    setIsAutoSyncEnabled(nextState);
    if (nextState) {
      // Immediately apply investment-derived burger
      setCustomization(prev => ({
        ...prev,
        ...deriveBurgerFromInvestments(investments),
      }));
    }
  };

  const handleResetToNew = () => {
    const nextGroup = String(companies.length + 1);
    setCurrentId(`group-${Date.now()}`);
    setGrade('6');
    setClassNum('1');
    setGroupNum(nextGroup);
    setStudentNames('');
    setCompanyName('');
    setProductName('');
    setInvestments({
      tasteQuality: 20,
      design: 20,
      service: 20,
      priceCompetitiveness: 20,
      advertising: 20,
    });
    setReasons({
      tasteQuality: '',
      design: '',
      service: '',
      priceCompetitiveness: '',
      advertising: '',
      mainFocusReason: '',
    });
    setPrice(6000);
    setCustomization({
      bun: 'sesame',
      patty: 'beef',
      toppings: ['cheese', 'lettuce_tomato'],
      sauce: '달콤바베큐',
      packaging: 'kraft',
      adModel: 'cute_mascot',
      adSlogan: '최고의 선택! 우리 모둠의 맛있는 도전!',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isBudgetExact) {
      alert(`투자 비용은 전액 100만 원을 정확히 사용해야 합니다!\n현재 투자 금액: ${totalInvested}만 원 (차이: ${remainingBudget > 0 ? `${remainingBudget}만 원 부족` : `${Math.abs(remainingBudget)}만 원 초과`})`);
      return;
    }

    if (!companyName.trim() || !productName.trim()) {
      alert('회사 이름과 제품(햄버거) 이름을 입력해 주세요!');
      return;
    }

    const companyToSave: Company = {
      id: currentId || `group-${Date.now()}`,
      grade: grade || '6',
      classNum: classNum || '1',
      groupNum: groupNum || '1',
      studentNames: studentNames || '모둠원',
      companyName: companyName.trim(),
      productName: productName.trim(),
      investments,
      reasons,
      mainFocus: highestCategory,
      price: Number(price) || 6000,
      costPerUnit: estimatedCostPerUnit,
      customization,
      createdAt: Date.now(),
    };

    onSaveCompany(companyToSave);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Group Selector & Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <span className="text-[160px] select-none">🍔</span>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>기업 모둠 활동지 작성 및 제품 개발</span>
              </div>
              <h2 className="font-jua text-2xl sm:text-3xl tracking-tight">
                ★ 우리 회사의 선택! 소비자의 마음을 잡아라! (기업)
              </h2>
              <p className="mt-1 text-sm sm:text-base text-amber-100 max-w-2xl">
                여러분은 햄버거를 만들고 판매하는 기업입니다. 주어진 <strong>100만 원</strong>의 투자 비용을 현명하게 나누어 소비자의 마음을 사로잡을 최고의 햄버거를 개발해 보세요!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToNew}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-orange-600 font-extrabold text-sm shadow-md hover:bg-orange-50 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                새 모둠 등록하기
              </button>
            </div>
          </div>

          {/* Quick Tabs to Switch Between Already Registered Teams */}
          {companies.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="text-xs font-bold text-amber-100 mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>등록된 기업 모둠 선택 및 수정 ({companies.length}개 모둠):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companies.map(c => {
                  const isSelected = (currentId === c.id) || (!currentId && selectedCompanyId === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectCompany(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-orange-700 shadow-md ring-2 ring-white/80'
                          : 'bg-black/20 text-white hover:bg-black/30'
                      }`}
                    >
                      <span>{c.groupNum}모둠</span>
                      <span className="opacity-80">({c.companyName || '미입력'})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-between shadow-sm animate-bounce">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>우리 회사의 100만 원 투자 계획과 햄버거 제품이 마켓에 성공적으로 출시되었습니다! 🎉</span>
          </div>
          <span className="text-xs text-emerald-600">소비자 마켓 탭에서 확인해 보세요!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Worksheet Information Block (활동지 상단 박스) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md">
          <div className="border-2 border-slate-900 rounded-2xl p-4 sm:p-6 bg-amber-50/30">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-900 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="font-jua text-xl sm:text-2xl text-slate-900">
                  ★ 우리 회사의 선택! 소비자의 마음을 잡아라! (기업)
                </span>
              </div>

              {/* Class & Group & Name inputs */}
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-800">
                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <input
                    type="text"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-8 text-center font-bold text-slate-900 focus:outline-hidden"
                  />
                  <span>학년</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <input
                    type="text"
                    value={classNum}
                    onChange={e => setClassNum(e.target.value)}
                    className="w-8 text-center font-bold text-slate-900 focus:outline-hidden"
                  />
                  <span>반</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <input
                    type="text"
                    value={groupNum}
                    onChange={e => setGroupNum(e.target.value)}
                    className="w-8 text-center font-bold text-orange-600 focus:outline-hidden"
                  />
                  <span>모둠</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
                  <span>이름:</span>
                  <input
                    type="text"
                    value={studentNames}
                    placeholder="모둠원 이름 (예: 민준, 서연, 지후)"
                    onChange={e => setStudentNames(e.target.value)}
                    className="w-44 text-sm font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Rules / Conditions Box from Worksheet */}
            <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-2xs mb-6">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2 text-center">
                〈 조 건 〉
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border border-slate-400 bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">✓</span>
                  <span>투자 비용은 전액(100만 원) 모두 사용해야 한다.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border border-slate-400 bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">✓</span>
                  <span>투자 비용을 고려하여 제품의 적절한 가격을 책정한다.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border border-slate-400 bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">✓</span>
                  <span>어떤 분야에 얼마나 투자할지는 모둠 협의를 통해 정한다.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border border-slate-400 bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">✓</span>
                  <span>모둠 협의를 통해 합의된 내용으로 작성한다.</span>
                </div>
              </div>
            </div>

            {/* Real-time Budget Counter Gauge */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              isBudgetExact
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : remainingBudget > 0
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'bg-rose-50 border-rose-400 text-rose-900'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-amber-600" />
                  <div>
                    <span className="font-bold text-sm">총 투자 예산 현황:</span>
                    <span className="font-jua text-xl sm:text-2xl ml-2">
                      {totalInvested}만 원 / 100만 원
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-bold text-sm">
                  {isBudgetExact ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      100만 원 전액 투자 완료! 조건 만족!
                    </span>
                  ) : remainingBudget > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs">
                      <AlertCircle className="w-4 h-4" />
                      {remainingBudget}만 원을 더 투자해야 합니다!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs">
                      <AlertCircle className="w-4 h-4" />
                      {Math.abs(remainingBudget)}만 원이 초과되었습니다!
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-3 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isBudgetExact
                      ? 'bg-emerald-500'
                      : remainingBudget > 0
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalInvested / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 1. Investment Allocation Table (활동지 1번 질문) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm">
                1
              </span>
              <h3 className="font-jua text-lg sm:text-xl text-slate-900">
                아래 제품의 조건 중 우리 기업에서 어떤 부분에 얼마나 투자하여 제품을 만들지 모둠 친구들과 함께 토의 후 작성해 봅시다.
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-9">
              ※ 정답은 없습니다. 우리 회사가 중요하다고 생각하는 곳에 자유롭게 투자합니다. (합계 100만 원)
            </p>
          </div>

          {/* Investment Rows */}
          <div className="space-y-4">
            {INVESTMENT_CATEGORIES.map(category => {
              const currentVal = investments[category.key];
              const currentReason = reasons[category.key];

              return (
                <div
                  key={category.key}
                  className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${category.color} ${
                    highestCategory === category.key ? 'ring-2 ring-amber-400' : ''
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Category Label & Description */}
                    <div className="lg:col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <h4 className="font-jua text-base sm:text-lg text-slate-900">
                          {category.title}
                        </h4>
                        {highestCategory === category.key && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                            최대 투자 분야
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {category.description}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        💡 {category.tip}
                      </p>
                    </div>

                    {/* Investment Control (+/- and slider and input) */}
                    <div className="lg:col-span-4 bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">투자 비용</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentVal}
                            onChange={e => handleInvestmentChange(category.key, parseInt(e.target.value) || 0)}
                            className="w-16 text-right font-jua text-xl text-slate-900 border border-slate-300 rounded-lg px-2 py-0.5 focus:outline-amber-500"
                          />
                          <span className="font-bold text-sm text-slate-700">만 원</span>
                        </div>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={currentVal}
                        onChange={e => handleInvestmentChange(category.key, parseInt(e.target.value) || 0)}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      {/* Quick Adjust Buttons */}
                      <div className="flex items-center justify-between gap-1 pt-1 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(category.key, -10)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          -10만
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(category.key, -5)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          -5만
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(category.key, +5)}
                          className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                        >
                          +5만
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(category.key, +10)}
                          className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                        >
                          +10만
                        </button>
                      </div>
                    </div>

                    {/* Reason input */}
                    <div className="lg:col-span-4 space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        왜 이렇게 정했나요? (모둠 토의 이유)
                      </label>
                      <textarea
                        rows={3}
                        value={currentReason}
                        onChange={e => setReasons(prev => ({ ...prev, [category.key]: e.target.value }))}
                        placeholder={`우리 회사가 ${category.title}에 ${currentVal}만 원을 투자하기로 한 까닭을 적어보세요.`}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-amber-500 text-slate-800 resize-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Summary Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-jua text-lg sm:text-xl">합계</span>
              <span className="text-xs text-slate-400">(조건: 정확히 100만 원)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-jua text-2xl ${
                isBudgetExact ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {totalInvested}만 원
              </span>
              {isBudgetExact ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-900 font-extrabold text-xs">
                  완벽해요!
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-extrabold text-xs">
                  {remainingBudget > 0 ? `${remainingBudget}만 원 더 채우기` : `${Math.abs(remainingBudget)}만 원 줄이기`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Product Name, Company Name, Price & Reasons (활동지 2번 질문) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm">
                2
              </span>
              <h3 className="font-jua text-lg sm:text-xl text-slate-900">
                모둠 친구들과 함께 우리 회사의 이름과 제품의 이름, 판매 가격을 정해 봅시다.
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Company & Product Names */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-800">
                  🏢 회사 이름 (브랜드명) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="예: 육즙팡팡 버거랩, 착한가격 반값버거, 킹버거프렌즈"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-amber-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-800">
                  🍔 제품 이름 (햄버거 이름) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="예: 100% 한우 스테이크 메가버거, 학생지갑지킴이 통살치킨버거"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-amber-500 shadow-2xs"
                />
              </div>

              {/* Main Focus & Its Reason */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-900">
                    ⭐ 가장 많이 투자한 분야
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-jua text-sm shadow-xs">
                    {highestCatInfo?.icon} {highestCatInfo?.title} ({investments[highestCategory]}만 원)
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    그 이유 (우리 회사의 핵심 전략):
                  </label>
                  <textarea
                    rows={3}
                    value={reasons.mainFocusReason}
                    onChange={e => setReasons(prev => ({ ...prev, mainFocusReason: e.target.value }))}
                    placeholder={`왜 ${highestCatInfo?.title}에 가장 많은 비용을 투자했는지 소비자의 마음을 잡기 위한 모둠의 핵심 전략을 적어주세요.`}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-amber-300 bg-white focus:outline-amber-500 text-slate-800 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Economic Calculation */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1">
                    <Calculator className="w-4 h-4" />
                    ▼ 제품의 최종 가격 책정
                  </span>
                  <span className="text-xs text-slate-400">적정 가격 협의</span>
                </div>

                <div className="mt-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">최종 판매가</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1000"
                        max="20000"
                        step="500"
                        value={price}
                        onChange={e => setPrice(parseInt(e.target.value) || 0)}
                        className="w-28 text-right font-jua text-2xl text-amber-400 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 focus:outline-amber-400"
                      />
                      <span className="font-jua text-xl text-amber-400">원</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>권장 추천가: 4,500원 ~ 8,500원</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPrice(4900)}
                        className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                      >
                        4,900
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrice(6500)}
                        className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                      >
                        6,500
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrice(7900)}
                        className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                      >
                        7,900
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic Break-even simulation guidance for students */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-3 text-slate-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>경제 팁: 기본 원가와 이윤 분석</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEconomicsDetail(!showEconomicsDetail)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer underline decoration-dotted"
                  >
                    <span>{showEconomicsDetail ? '계산식 접기' : '원리 자세히 보기'}</span>
                    {showEconomicsDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Summary numbers */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">1개당 총 제조원가:</span>
                    <span className="font-bold text-white text-sm">{estimatedCostPerUnit.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">1개 판매 시 남는 이윤(마진):</span>
                    <span className="font-bold text-emerald-400 text-sm">+{marginPerUnit.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">투자금 100만 원 회수(손익분기점):</span>
                    <span className="font-jua text-amber-300 text-base">{breakEvenUnits.toLocaleString()}개</span>
                  </div>
                </div>

                {/* Detailed Breakdown when opened */}
                {showEconomicsDetail && (
                  <div className="pt-3 border-t border-slate-700/80 space-y-2 text-[11px] text-slate-300 animate-in fade-in">
                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700 space-y-1.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>💡 햄버거 1개 기본 원가 산출 공식</span>
                      </div>
                      <div className="text-slate-400 leading-relaxed">
                        • 기초 식재료(빵·기본채소): <strong>{costBreakdown.baseCost.toLocaleString()}원</strong><br />
                        • 맛·품질 투자({investments.tasteQuality}만 원): <strong>+{costBreakdown.tasteCost.toLocaleString()}원</strong> (프리미엄 패티·특제소스)<br />
                        • 디자인 포장비({investments.design}만 원): <strong>+{costBreakdown.packagingCost.toLocaleString()}원</strong> (친환경·틴케이스)<br />
                        • 서비스 비품비({investments.service}만 원): <strong>+{costBreakdown.serviceCost.toLocaleString()}원</strong> (굿즈·쿠폰 인쇄)<br />
                        👉 <strong className="text-white">합계 1개당 제조원가 = {estimatedCostPerUnit.toLocaleString()}원</strong>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700 space-y-1">
                      <div className="font-bold text-emerald-300">
                        💰 1개당 남는 이윤 = 판매가 - 제조원가
                      </div>
                      <p className="text-slate-400 leading-relaxed">
                        판매가 {price.toLocaleString()}원에서 원가 {estimatedCostPerUnit.toLocaleString()}원을 뺀 <strong>+{marginPerUnit.toLocaleString()}원</strong>이 햄버거 1개를 팔 때마다 모둠에게 실제로 남는 돈입니다.
                      </p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700 space-y-1">
                      <div className="font-bold text-amber-300">
                        🎯 손익분기점 = 초기 투자비용(100만 원) ÷ 1개당 이윤
                      </div>
                      <p className="text-slate-400 leading-relaxed">
                        우리가 100만 원을 먼저 투자했으므로, 1,000,000 ÷ {marginPerUnit.toLocaleString()} = <strong className="text-white">{breakEvenUnits}개</strong>를 팔아야 100만 원 투자금을 모두 메우고(본전), {breakEvenUnits + 1}개째부터 진짜 순이익(흑자)이 생깁니다!
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-300 leading-relaxed">
                  💡 <strong>경제 팁:</strong> 가격을 무조건 싸게 하면 1개당 이윤이 너무 적어 본전을 찾기 힘들고, 너무 비싸게 하면 소비자가 사지 않아요! 적정한 가격을 찾는 것이 핵심입니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Automatic Visual Showcase Driven by Investments (투자금 반영 자동 완성 쇼케이스) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-sm">
                3
              </span>
              <div>
                <h3 className="font-jua text-lg sm:text-xl text-slate-900">
                  우리 회사의 100만 원 투자 비주얼 쇼케이스 (투자금 반영 자동 완성)
                </h3>
                <p className="text-xs text-slate-500">
                  1번에서 설정한 100만 원 투자 비율에 따라 버거의 높이와 재료, 패키지 상자, 광고 전광판, 서비스 세트가 자동으로 실시간 조립됩니다!
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>실시간 100만 원 투자 연동 완료</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Investment Visual Breakdown Cards (5대 투자 결과 요약) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>우리 모둠의 5대 투자 전략 시각화 분석</span>
              </div>

              {/* 1. Taste quality card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                investments.tasteQuality >= 35
                  ? 'bg-amber-50/90 border-amber-400 text-amber-950'
                  : investments.tasteQuality >= 20
                  ? 'bg-amber-50/40 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>🥩</span> 맛·품질 투자: <strong>{investments.tasteQuality}만 원</strong>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-amber-300">
                    {investments.tasteQuality >= 35 ? '육즙더블 1등급 한우' : investments.tasteQuality >= 20 ? '두툼 통살 치킨' : '기본 패티'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {investments.tasteQuality >= 35
                    ? '👉 1등급 프리미엄 한우 패티가 더블(2장!)로 들어가고, 흘러내리는 멜팅 치즈와 구운 양파, 베이컨이 탑재되어 거대하고 높은 버거 타워가 완성되었습니다! ✨'
                    : investments.tasteQuality >= 20
                    ? '👉 두툼한 패티와 싱싱한 토마토, 체다 치즈가 들어가 기본에 충실한 맛있는 햄버거가 되었습니다.'
                    : '👉 가성비를 위해 담백하고 심플한 기본 재료로 구성되었습니다.'}
                </p>
              </div>

              {/* 2. Design card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                investments.design >= 35
                  ? 'bg-purple-50/90 border-purple-400 text-purple-950'
                  : investments.design >= 20
                  ? 'bg-purple-50/40 border-purple-200 text-purple-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>🎨</span> 디자인 투자: <strong>{investments.design}만 원</strong>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-purple-300">
                    {investments.design >= 35 ? '👑 골드 럭셔리 전용 박스' : investments.design >= 20 ? '✨ 힙스타 네온 틴케이스' : '심플 포장지'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {investments.design >= 35
                    ? '👉 오징어먹물 블랙번과 함께 버거 옆에 번쩍이는 골드 전용 선물 박스와 브랜드 로고가 포장 디자인으로 멋지게 진열됩니다!'
                    : investments.design >= 20
                    ? '👉 인스타에 올리고 싶은 감각적인 네온 틴케이스와 버터 브리오슈번으로 세련된 비주얼을 자랑합니다.'
                    : '👉 환경을 생각하는 심플한 크라프트지 포장으로 깔끔하게 포장됩니다.'}
                </p>
              </div>

              {/* 3. Advertising card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                investments.advertising >= 35
                  ? 'bg-pink-50/90 border-pink-400 text-pink-950'
                  : investments.advertising >= 20
                  ? 'bg-pink-50/40 border-pink-200 text-pink-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>📢</span> 광고 투자: <strong>{investments.advertising}만 원</strong>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-pink-300">
                    {investments.advertising >= 35 ? '🌟 K-POP 대세 아이돌' : investments.advertising >= 20 ? '🎬 100만 먹방 크리에이터' : '기본 포스터'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {investments.advertising >= 35
                    ? '👉 글로벌 아이돌이 전속 모델로 발탁되어 TV와 유튜브에서 화제가 된 번쩍이는 네온 전광판과 스타 마케팅 뱃지가 붙습니다!'
                    : investments.advertising >= 20
                    ? '👉 100만 먹방 크리에이터의 추천 슬로건과 눈에 띄는 홍보 리본이 소비자들의 눈길을 끕니다.'
                    : '👉 학교 앞 게시판 홍보를 통해 기본 광고를 진행합니다.'}
                </p>
              </div>

              {/* 4. Service card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                investments.service >= 22
                  ? 'bg-blue-50/90 border-blue-400 text-blue-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>🛵</span> 서비스 투자: <strong>{investments.service}만 원</strong>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-blue-300">
                    {investments.service >= 22 ? '🍟 감튀+음료 덤 증정 & 배달' : '기본 서비스'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {investments.service >= 22
                    ? '👉 버거 트레이 옆에 바삭한 황금 감자튀김과 시원한 탄산음료 덤, 그리고 모둠 한정판 캐릭터 키링 굿즈가 함께 서빙됩니다!'
                    : '👉 정성스러운 매장 테이크아웃 서비스가 제공됩니다.'}
                </p>
              </div>

              {/* 5. Price Competitiveness card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                investments.priceCompetitiveness >= 22
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>🏷️</span> 가격 경쟁력 투자: <strong>{investments.priceCompetitiveness}만 원</strong>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-emerald-300">
                    {investments.priceCompetitiveness >= 22 ? '🔥 학생 1+1 반값할인' : '정가 판매'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {investments.priceCompetitiveness >= 22
                    ? '👉 버거 우측 상단에 강렬한 "학생 1+1 반값 할인" 대박 스티커가 붙어 알뜰 소비자들의 시선을 사로잡습니다!'
                    : '👉 정가 판매 정책을 유지합니다.'}
                </p>
              </div>

              {/* Company Slogan Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  📢 우리 회사의 한 줄 광고 슬로건 (직접 작성 가능)
                </label>
                <input
                  type="text"
                  value={customization.adSlogan}
                  onChange={e => setCustomization(prev => ({ ...prev, adSlogan: e.target.value }))}
                  placeholder="예: 한 입 베어무는 순간 터지는 육즙의 향연!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Right: The Complete Live Burger Store Showcase Stage */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-amber-50/70 via-orange-50/50 to-amber-100/40 rounded-3xl border-2 border-amber-300 shadow-inner space-y-3">
              <div className="flex items-center justify-between w-full border-b border-amber-200/80 pb-2">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>실시간 매장 쇼케이스 전시대</span>
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-md font-bold text-amber-700 border border-amber-200 shadow-2xs">
                  {companyName || '우리 회사'} 전용 세트
                </span>
              </div>

              {/* BurgerVisualizer containing all dynamic elements */}
              <BurgerVisualizer
                customization={customization}
                productName={productName || '우리 모둠 특제 버거'}
                companyName={companyName || '우리 회사'}
                price={price}
                size="lg"
                investments={investments}
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-amber-300 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-jua text-base sm:text-lg text-slate-800">
              {companyName ? `🏢 [${companyName}]` : '우리 모둠 기업'} 햄버거 출시 준비 완료
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              isBudgetExact ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isBudgetExact ? '투자금 100만 원 충족' : `투자금 확인 필요 (${totalInvested}만 원)`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentId && companies.some(c => c.id === currentId) && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('정말로 이 모둠의 등록 정보를 삭제하시겠습니까?')) {
                    onDeleteCompany(currentId);
                    handleResetToNew();
                  }
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-sm font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                삭제
              </button>
            )}

            <button
              type="submit"
              disabled={!isBudgetExact}
              className={`px-6 py-3 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isBudgetExact
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-orange-500/25 scale-[1.02]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>시장(마켓)에 제품 출시하기!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
