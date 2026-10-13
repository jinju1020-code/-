import { Company, PurchaseReview, SimulationResult } from '../types';

interface ConsumerArchetype {
  id: string;
  name: string;
  type: 'gourmet' | 'bargain' | 'visual' | 'trendy' | 'convenience';
  budgetMax: number;
  weights: {
    taste: number;
    price: number;
    design: number;
    ad: number;
    service: number;
  };
}

const FIRST_NAMES = ['김민서', '이준혁', '박지민', '최수빈', '정우진', '강서윤', '조현우', '윤하린', '장민준', '임예은', '한태양', '오유나', '송시우', '배도현', '신지우', '권민재', '황서아', '안재민', '송채린', '홍성민'];

export function runClassroomMarketSimulation(
  companies: Company[],
  consumerCount: number = 60
): SimulationResult {
  if (companies.length === 0) {
    return {
      totalSimulatedConsumers: 0,
      breakdownByType: { gourmet: 0, bargain: 0, visual: 0, trendy: 0, convenience: 0 },
      companySales: {},
      generatedReviews: [],
    };
  }

  const breakdownByType = {
    gourmet: Math.round(consumerCount * 0.25),
    bargain: Math.round(consumerCount * 0.30),
    visual: Math.round(consumerCount * 0.15),
    trendy: Math.round(consumerCount * 0.20),
    convenience: consumerCount - Math.round(consumerCount * 0.25) - Math.round(consumerCount * 0.30) - Math.round(consumerCount * 0.15) - Math.round(consumerCount * 0.20),
  };

  const archetypes: ConsumerArchetype[] = [];

  // 1. Gourmet
  for (let i = 0; i < breakdownByType.gourmet; i++) {
    archetypes.push({
      id: `gourmet-${i}`,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} (미식가형)`,
      type: 'gourmet',
      budgetMax: 9000,
      weights: { taste: 0.65, price: 0.1, design: 0.1, ad: 0.05, service: 0.1 },
    });
  }

  // 2. Bargain
  for (let i = 0; i < breakdownByType.bargain; i++) {
    archetypes.push({
      id: `bargain-${i}`,
      name: `${FIRST_NAMES[(i + 4) % FIRST_NAMES.length]} (알뜰가성비형)`,
      type: 'bargain',
      budgetMax: 6000,
      weights: { taste: 0.15, price: 0.60, design: 0.05, ad: 0.05, service: 0.15 },
    });
  }

  // 3. Visual
  for (let i = 0; i < breakdownByType.visual; i++) {
    archetypes.push({
      id: `visual-${i}`,
      name: `${FIRST_NAMES[(i + 8) % FIRST_NAMES.length]} (디자인/감성형)`,
      type: 'visual',
      budgetMax: 8500,
      weights: { taste: 0.2, price: 0.15, design: 0.5, ad: 0.1, service: 0.05 },
    });
  }

  // 4. Trendy
  for (let i = 0; i < breakdownByType.trendy; i++) {
    archetypes.push({
      id: `trendy-${i}`,
      name: `${FIRST_NAMES[(i + 12) % FIRST_NAMES.length]} (유행/광고형)`,
      type: 'trendy',
      budgetMax: 8000,
      weights: { taste: 0.2, price: 0.15, design: 0.15, ad: 0.45, service: 0.05 },
    });
  }

  // 5. Convenience
  for (let i = 0; i < breakdownByType.convenience; i++) {
    archetypes.push({
      id: `convenience-${i}`,
      name: `${FIRST_NAMES[(i + 16) % FIRST_NAMES.length]} (편의/서비스형)`,
      type: 'convenience',
      budgetMax: 7500,
      weights: { taste: 0.2, price: 0.2, design: 0.1, ad: 0.05, service: 0.45 },
    });
  }

  const companySales: Record<string, number> = {};
  companies.forEach(c => (companySales[c.id] = 0));

  const generatedReviews: PurchaseReview[] = [];

  // Average price across market
  const avgPrice = companies.reduce((acc, c) => acc + c.price, 0) / companies.length;

  archetypes.forEach((consumer, idx) => {
    // Calculate attractiveness score for each company
    const scores = companies.map(company => {
      // Price attractiveness (lower is better, higher price competitiveness investment boosts it)
      const priceRatio = avgPrice / Math.max(company.price, 3000);
      const priceCompetitivenessScore = (company.investments.priceCompetitiveness / 100) * 1.5 + (priceRatio * 0.5);

      const tasteScore = company.investments.tasteQuality / 100;
      const designScore = company.investments.design / 100;
      const adScore = company.investments.advertising / 100;
      const serviceScore = company.investments.service / 100;

      // Budget check penalty
      let penalty = 1.0;
      if (company.price > consumer.budgetMax) {
        penalty = 0.25; // Much less likely to afford
      }

      const totalScore = (
        tasteScore * consumer.weights.taste +
        priceCompetitivenessScore * consumer.weights.price +
        designScore * consumer.weights.design +
        adScore * consumer.weights.ad +
        serviceScore * consumer.weights.service
      ) * penalty;

      // Add a tiny random noise to simulate individual taste variation
      const noise = (Math.random() - 0.5) * 0.1;
      return {
        company,
        score: Math.max(0.01, totalScore + noise),
      };
    });

    // Weighted random choice based on scores
    const totalScoreSum = scores.reduce((sum, item) => sum + item.score, 0);
    let rand = Math.random() * totalScoreSum;
    let chosenCompany = scores[0].company;

    for (const item of scores) {
      if (rand <= item.score) {
        chosenCompany = item.company;
        break;
      }
      rand -= item.score;
    }

    companySales[chosenCompany.id] = (companySales[chosenCompany.id] || 0) + 1;

    // Determine primary reason & rating & comment
    let primaryReason: 'taste' | 'price' | 'design' | 'service' | 'advertising' = 'taste';
    let rating = 4;
    let comment = '맛있게 잘 먹었습니다!';

    if (consumer.type === 'bargain') {
      primaryReason = 'price';
      rating = chosenCompany.price <= 5500 ? 5 : 4;
      const comments = [
        `가격이 ${chosenCompany.price.toLocaleString()}원이라 가성비 최고예요! 용돈이 굳었어요.`,
        `친구들이랑 부담 없이 사먹을 수 있어서 너무 좋아요!`,
        `할인 혜택과 가격 경쟁력이 확실해서 골랐습니다.`,
      ];
      comment = comments[idx % comments.length];
    } else if (consumer.type === 'gourmet') {
      primaryReason = 'taste';
      rating = chosenCompany.investments.tasteQuality >= 35 ? 5 : 4;
      const comments = [
        `재료가 진짜 신선하고 육즙과 풍미가 남달라요! 맛에 집중한 게 느껴집니다.`,
        `한 입 먹자마자 반했어요. 좋은 재료 쓴 게 입안에서 바로 느껴져요.`,
        `역시 음식은 맛이 1등이어야죠! 돈이 아깝지 않은 퀄리티입니다.`,
      ];
      comment = comments[idx % comments.length];
    } else if (consumer.type === 'trendy') {
      primaryReason = 'advertising';
      rating = chosenCompany.investments.advertising >= 30 ? 5 : 4;
      const comments = [
        `광고 문구와 모델이 너무 찰떡이라 안 살 수가 없었어요!`,
        `요즘 친구들 사이에서 난리 난 버거라 제일 먼저 사먹었습니다.`,
        `광고에 혹해서 샀는데 기대 이상으로 트렌디하고 맛있어요!`,
      ];
      comment = comments[idx % comments.length];
    } else if (consumer.type === 'visual') {
      primaryReason = 'design';
      rating = chosenCompany.investments.design >= 30 ? 5 : 4;
      const comments = [
        `포장 패키지가 너무 센스 있고 버거 비주얼이 예술이에요!`,
        `인증샷 찍기 딱 좋은 예쁜 버거예요. 패키지 디자인 100점!`,
        `눈으로 먼저 먹고 입으로 또 먹는 환상적인 비주얼입니다.`,
      ];
      comment = comments[idx % comments.length];
    } else {
      primaryReason = 'service';
      rating = chosenCompany.investments.service >= 25 ? 5 : 4;
      const comments = [
        `주문도 빠르고 쿠폰/굿즈 서비스가 너무 친절해서 감동했어요.`,
        `고객 응대와 배달 편의성에 신경 써줘서 기분 좋게 먹었습니다.`,
        `손님을 배려하는 서비스 혜택이 최고예요!`,
      ];
      comment = comments[idx % comments.length];
    }

    generatedReviews.push({
      id: `sim-rev-${Date.now()}-${idx}`,
      companyId: chosenCompany.id,
      consumerName: consumer.name,
      quantity: 1,
      totalPaid: chosenCompany.price,
      primaryReason,
      rating,
      comment,
      timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 15),
    });
  });

  return {
    totalSimulatedConsumers: consumerCount,
    breakdownByType,
    companySales,
    generatedReviews,
  };
}
