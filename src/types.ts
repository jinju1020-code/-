export interface InvestmentBreakdown {
  tasteQuality: number; // 맛·품질 (만원)
  design: number;       // 디자인 (만원)
  service: number;      // 서비스 (만원)
  priceCompetitiveness: number; // 가격 경쟁력 (만원)
  advertising: number;  // 광고 (만원)
}

export interface InvestmentReasons {
  tasteQuality: string;
  design: string;
  service: string;
  priceCompetitiveness: string;
  advertising: string;
  mainFocusReason: string;
}

export interface BurgerCustomization {
  bun: 'regular' | 'sesame' | 'brioche' | 'black_squid';
  patty: 'beef' | 'chicken' | 'shrimp' | 'vegan';
  toppings: string[]; // e.g. ['cheese', 'lettuce_tomato', 'bacon', 'pickle', 'onion']
  sauce: string; // e.g. '달콤바베큐', '매콤스파이시', '고소마요', '트러플특제'
  packaging: 'kraft' | 'gold_box' | 'retro' | 'eco_green';
  adModel: 'kid_hero' | 'top_idol' | 'food_youtuber' | 'cute_mascot';
  adSlogan: string;
}

export interface Company {
  id: string;
  grade: string; // 6학년
  classNum: string; // 반
  groupNum: string; // 모둠
  studentNames: string; // 이름
  companyName: string; // 회사 이름
  productName: string; // 제품 이름
  investments: InvestmentBreakdown;
  reasons: InvestmentReasons;
  mainFocus: keyof InvestmentBreakdown;
  price: number; // 최종 판매 가격 (원)
  costPerUnit: number; // 단위당 제조원가 (기본 약 2,500원 ~ 4,000원 - 맛투자에 따라 변동)
  customization: BurgerCustomization;
  createdAt: number;
}

export interface PurchaseReview {
  id: string;
  companyId: string;
  consumerName: string;
  consumerGroup?: string;
  quantity: number;
  totalPaid: number;
  primaryReason: 'taste' | 'price' | 'design' | 'service' | 'advertising';
  rating: number; // 1 ~ 5
  comment: string;
  timestamp: number;
}

export interface ConsumerState {
  name: string;
  budget: number; // 기본 30,000원
  purchases: PurchaseReview[];
}

export interface SimulationResult {
  totalSimulatedConsumers: number;
  breakdownByType: {
    gourmet: number;    // 맛/품질 중시
    bargain: number;    // 가성비/가격 중시
    visual: number;     // 디자인/포장 중시
    trendy: number;     // 광고/유행 중시
    convenience: number;// 서비스/배달 중시
  };
  companySales: Record<string, number>;
  generatedReviews: PurchaseReview[];
}
