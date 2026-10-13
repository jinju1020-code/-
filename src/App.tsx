import React, { useState, useEffect } from 'react';
import { Company, PurchaseReview, ConsumerState } from './types';
import { INITIAL_COMPANIES } from './data/mockCompanies';
import { Header } from './components/Header';
import { CompanyForm } from './components/CompanyForm';
import { ConsumerMarket } from './components/ConsumerMarket';
import { LiveDashboard } from './components/LiveDashboard';
import { WorksheetPrintModal } from './components/WorksheetPrintModal';
import { EconomicsConceptsModal } from './components/EconomicsConceptsModal';
import { Sparkles, HelpCircle, BookOpen, Printer } from 'lucide-react';

const STORAGE_KEYS = {
  COMPANIES: 'ais_burger_companies_v1',
  REVIEWS: 'ais_burger_reviews_v1',
  CONSUMER: 'ais_burger_consumer_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'company' | 'market' | 'dashboard'>('company');

  // Load companies
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_COMPANIES;
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    return companies[0]?.id || '';
  });

  // Load reviews / purchases
  const [allReviews, setAllReviews] = useState<PurchaseReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Initial sample purchases
    return [
      {
        id: 'init-rev-1',
        companyId: 'group-1',
        consumerName: '김민서 (6-1)',
        quantity: 1,
        totalPaid: 7500,
        primaryReason: 'taste',
        rating: 5,
        comment: '1등급 한우 패티 육즙이 입안에서 팡팡 터져요! 최고!',
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: 'init-rev-2',
        companyId: 'group-2',
        consumerName: '박준혁 (6-1)',
        quantity: 2,
        totalPaid: 9000,
        primaryReason: 'price',
        rating: 5,
        comment: '4,500원이라 친구랑 둘이 사먹어도 만원이 안 넘어요. 짱!',
        timestamp: Date.now() - 1000 * 60 * 20,
      },
      {
        id: 'init-rev-3',
        companyId: 'group-3',
        consumerName: '최예은 (6-1)',
        quantity: 1,
        totalPaid: 6800,
        primaryReason: 'advertising',
        rating: 5,
        comment: '아이돌 포토카드도 받고 매콤한 통새우버거도 너무 맛있어요!',
        timestamp: Date.now() - 1000 * 60 * 10,
      },
      {
        id: 'init-rev-4',
        companyId: 'group-4',
        consumerName: '이지민 (6-1)',
        quantity: 1,
        totalPaid: 7200,
        primaryReason: 'design',
        rating: 5,
        comment: '친환경 포장 패키지가 너무 예쁘고 속도 편안해요.',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    ];
  });

  // Consumer state
  const [consumerState, setConsumerState] = useState<ConsumerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSUMER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      name: '6학년 알뜰소비자',
      budget: 30000,
      purchases: [],
    };
  });

  // Modals
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [isEconomicsGuideOpen, setIsEconomicsGuideOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    } catch (e) {}
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
    } catch (e) {}
  }, [allReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSUMER, JSON.stringify(consumerState));
    } catch (e) {}
  }, [consumerState]);

  // Handle saving company
  const handleSaveCompany = (savedCompany: Company) => {
    setCompanies(prev => {
      const exists = prev.some(c => c.id === savedCompany.id);
      if (exists) {
        return prev.map(c => (c.id === savedCompany.id ? savedCompany : c));
      } else {
        return [...prev, savedCompany];
      }
    });
    setSelectedCompanyId(savedCompany.id);
  };

  // Handle deleting company
  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    if (selectedCompanyId === id) {
      setSelectedCompanyId(companies[0]?.id || '');
    }
  };

  // Handle recording single purchase
  const handleRecordPurchase = (review: PurchaseReview) => {
    setAllReviews(prev => [review, ...prev]);
    setConsumerState(prev => ({
      ...prev,
      purchases: [review, ...prev.purchases],
    }));
  };

  // Handle batch simulated reviews
  const handleAddSimulatedReviews = (newReviews: PurchaseReview[]) => {
    setAllReviews(prev => [...newReviews, ...prev]);
  };

  // Reset reviews
  const handleClearSimulations = () => {
    if (confirm('판매 데이터와 평가 내역을 모두 초기화하시겠습니까?')) {
      setAllReviews([]);
      setConsumerState(prev => ({
        ...prev,
        budget: 30000,
        purchases: [],
      }));
    }
  };

  // Reset entire application data
  const handleResetData = () => {
    if (confirm('전체 데이터를 초기 예시 데이터로 되돌리시겠습니까?')) {
      localStorage.removeItem(STORAGE_KEYS.COMPANIES);
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.CONSUMER);
      setCompanies(INITIAL_COMPANIES);
      setSelectedCompanyId(INITIAL_COMPANIES[0].id);
      setAllReviews([]);
      setConsumerState({
        name: '6학년 알뜰소비자',
        budget: 30000,
        purchases: [],
      });
      alert('초기 4개 모둠 예시 데이터로 복원되었습니다.');
    }
  };

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWorksheet={() => setIsWorksheetOpen(true)}
        onOpenEconomicsGuide={() => setIsEconomicsGuideOpen(true)}
        onResetData={handleResetData}
        companyCount={companies.length}
        totalSalesCount={allReviews.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'company' && (
          <CompanyForm
            companies={companies}
            onSaveCompany={handleSaveCompany}
            onDeleteCompany={handleDeleteCompany}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
          />
        )}

        {activeTab === 'market' && (
          <ConsumerMarket
            companies={companies}
            consumerState={consumerState}
            onRecordPurchase={handleRecordPurchase}
            onUpdateBudget={(b) => setConsumerState(prev => ({ ...prev, budget: b }))}
            onUpdateConsumerName={(n) => setConsumerState(prev => ({ ...prev, name: n }))}
            allReviews={allReviews}
          />
        )}

        {activeTab === 'dashboard' && (
          <LiveDashboard
            companies={companies}
            allReviews={allReviews}
            onAddReviews={handleAddSimulatedReviews}
            onClearSimulations={handleClearSimulations}
          />
        )}
      </main>

      {/* Bottom Footer for Classroom Instruction */}
      <footer className="no-print border-t border-amber-200/80 bg-white/80 backdrop-blur-xs py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-jua text-sm text-slate-800">
              ★우리 회사의 선택! 소비자의 마음을 잡아라!
            </span>
            <span>• 초등학교 6학년 경제 공개수업 협력 프로젝트</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={() => setIsEconomicsGuideOpen(true)}
              className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              경제 핵심 개념
            </button>
            <button
              onClick={() => setIsWorksheetOpen(true)}
              className="hover:text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              수업 활동지 인쇄
            </button>
          </div>
        </div>
      </footer>

      {/* Worksheet Modal */}
      <WorksheetPrintModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        currentCompany={currentCompany}
      />

      {/* Economics Concepts Modal */}
      <EconomicsConceptsModal
        isOpen={isEconomicsGuideOpen}
        onClose={() => setIsEconomicsGuideOpen(false)}
      />
    </div>
  );
}
