import { InvestmentBreakdown, BurgerCustomization } from '../types';

/**
 * 5대 투자 분야(맛, 디자인, 서비스, 가격, 광고)의 투자 금액에 따라
 * 햄버거의 패티, 빵(번), 토핑, 패키지, 광고 모델, 슬로건을 자동 도출합니다.
 */
export function deriveBurgerFromInvestments(investments: InvestmentBreakdown): BurgerCustomization {
  const { tasteQuality, design, advertising } = investments;

  // 1. 맛·품질 투자에 따른 패티, 소스, 토핑 변화
  let patty: BurgerCustomization['patty'] = 'beef';
  let sauce = '달콤바베큐';
  let toppings: string[] = ['lettuce_tomato'];

  if (tasteQuality < 15) {
    // 15만원 미만: 담백 채소/비건 패티 (기본형)
    patty = 'vegan';
    sauce = '담백오리지널';
    toppings = ['lettuce_tomato'];
  } else if (tasteQuality < 25) {
    // 15~24만원: 바삭 크리스피 치킨 패티
    patty = 'chicken';
    sauce = '달콤바베큐';
    toppings = ['cheese', 'lettuce_tomato'];
  } else if (tasteQuality < 38) {
    // 25~37만원: 탱글탱글 통새우 패티
    patty = 'shrimp';
    sauce = '매콤스파이시';
    toppings = ['cheese', 'lettuce_tomato', 'pickle'];
  } else {
    // 38만원 이상: 1등급 프리미엄 한우 쇠고기 패티
    patty = 'beef';
    sauce = '트러플특제';
    toppings = ['cheese', 'lettuce_tomato', 'pickle', 'onion'];
  }

  // 2. 디자인 투자에 따른 번(빵)과 패키지(포장) 변화
  let bun: BurgerCustomization['bun'] = 'sesame';
  let packaging: BurgerCustomization['packaging'] = 'kraft';

  if (design < 15) {
    // 15만원 미만: 오리지널 기본 번 + 친환경 크라프트지
    bun = 'regular';
    packaging = 'kraft';
  } else if (design < 25) {
    // 15~24만원: 고소한 참깨번 + 100% 생분해 에코팩
    bun = 'sesame';
    packaging = 'eco_green';
  } else if (design < 38) {
    // 25~37만원: 버터 풍미 브리오슈번 + 힙스타 네온 틴케이스
    bun = 'brioche';
    packaging = 'retro';
  } else {
    // 38만원 이상: 프리미엄 오징어먹물 블랙번 + 골드 프리미엄 박스
    bun = 'black_squid';
    packaging = 'gold_box';
  }

  // 3. 광고 투자에 따른 광고 모델과 슬로건 변화
  let adModel: BurgerCustomization['adModel'] = 'cute_mascot';
  let adSlogan = '우리가 만들어 더 맛있는 햄버거!';

  if (advertising < 15) {
    adModel = 'kid_hero';
    adSlogan = '착한 가격과 기본에 충실한 햄버거!';
  } else if (advertising < 25) {
    adModel = 'cute_mascot';
    adSlogan = '귀요미 마스코트와 함께 즐기는 꿀맛 버거!';
  } else if (advertising < 38) {
    adModel = 'food_youtuber';
    adSlogan = '100만 먹방 크리에이터가 강력 추천한 육즙 버거!';
  } else {
    adModel = 'top_idol';
    adSlogan = '대세 글로벌 아이돌이 반한 감동의 한 입!';
  }

  return {
    bun,
    patty,
    toppings,
    sauce,
    packaging,
    adModel,
    adSlogan,
  };
}

/**
 * 1개당 제조원가 계산:
 * 기본 기초 식자재비(1,800원) + 맛 투자에 따른 신선 식재료비 + 디자인 포장비 + 서비스 비품비
 */
export function calculateCostBreakdown(investments: InvestmentBreakdown, price: number) {
  const baseCost = 1800; // 기본 식재료(번, 채소, 기본 소스, 최소 제조비)
  const tasteCost = Math.round(investments.tasteQuality * 35); // 맛 투자: 프리미엄 패티, 고급 유기농 재료
  const packagingCost = Math.round(investments.design * 10);   // 디자인 투자: 고급 포장 박스, 인쇄비
  const serviceCost = Math.round(investments.service * 5);     // 서비스 투자: 물티슈, 굿즈, 쿠폰 인쇄

  const totalCostPerUnit = baseCost + tasteCost + packagingCost + serviceCost;
  const marginPerUnit = Math.max(100, price - totalCostPerUnit);
  const breakEvenUnits = Math.ceil(1000000 / marginPerUnit);

  return {
    baseCost,
    tasteCost,
    packagingCost,
    serviceCost,
    totalCostPerUnit,
    marginPerUnit,
    breakEvenUnits,
  };
}
