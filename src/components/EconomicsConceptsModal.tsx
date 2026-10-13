import React from 'react';
import { BookOpen, X, Lightbulb, TrendingUp, DollarSign, Scale, Users } from 'lucide-react';

interface EconomicsConceptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconomicsConceptsModal: React.FC<EconomicsConceptsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const concepts = [
    {
      title: '1. 기업의 목적과 이윤 (Profit)',
      icon: <DollarSign className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-50 border-amber-200',
      description: '기업은 사람들이 필요로 하는 물건이나 서비스를 생산하여 제공하고, 그 대가로 "이윤(순이익)"을 얻는 경제 주체입니다.',
      formula: '순이익 = 총 매출액 - (투자 비용 + 재료 원가)',
      lesson: '아무리 햄버거를 많이 팔아도 투자금과 원가보다 매출이 적으면 손해(적자)를 보게 됩니다. 따라서 적절한 가격 책정이 매우 중요합니다.',
    },
    {
      title: '2. 희소성과 기회비용 (Opportunity Cost)',
      icon: <Scale className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      description: '우리가 가진 자원(100만 원)은 한정되어 있습니다. 이를 "자원의 희소성"이라고 합니다.',
      formula: '기회비용: 한 가지를 선택함으로써 포기해야 하는 다른 것의 가치',
      lesson: '맛·품질에 50만 원을 쓰면 그만큼 광고나 디자인에 쓸 돈이 줄어듭니다. 모둠 친구들과 무엇이 더 중요한지 협의하는 과정이 바로 합리적 의사결정입니다.',
    },
    {
      title: '3. 소비자의 합리적 선택 (Rational Choice)',
      icon: <Users className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      description: '소비자는 제한된 용돈으로 가장 큰 만족(효용)을 얻기 위해 여러 상품을 비교합니다.',
      formula: '합리적 소비 = 가격 대비 만족도(가성비 + 가심비) 극대화',
      lesson: '단순히 유명한 광고나 비싼 가격에 휩쓸리지 않고, 맛과 재료, 친절한 서비스를 꼼꼼히 따져보고 구매하는 태도가 현명한 소비자입니다.',
    },
    {
      title: '4. 시장과 가격의 상호작용 (Market & Price)',
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-200',
      description: '기업이 판매하려는 마음(공급)과 소비자가 사고 싶어 하는 마음(수요)이 만나는 곳이 바로 "시장(Market)"입니다.',
      formula: '가격이 높으면 소비자는 덜 사고, 가격이 낮으면 더 많이 삽니다.',
      lesson: '기업은 소비자의 반응을 관찰하며 다음 투자와 가격을 조정하고, 소비자는 좋은 기업을 선택함으로써 시장을 더 발전시킵니다.',
    },
    {
      title: '5. 기본 원가, 1개당 이윤, 손익분기점 (Unit Economics)',
      icon: <DollarSign className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-300',
      description: '물건을 팔 때 실제로 모둠에게 남는 돈과 투자금을 회수하는 기준입니다.',
      formula: '1개당 원가 = 기본 식재료(1,800원) + 투자금별 재료비 | 손익분기점 = 100만 원 ÷ 1개당 이윤',
      lesson: '가격을 4,000원으로 너무 낮추면 1개당 800원밖에 안 남아 1,250개를 팔아야 본전이고, 가격을 9,000원으로 올리면 200개만 팔아도 본전이지만 비싸서 손님이 적어집니다. 따라서 "적정 가격"을 찾는 균형이 중요합니다.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">
                초등 6학년 사회과 경제 단원
              </span>
              <h3 className="font-jua text-xl sm:text-2xl text-slate-900">
                수업과 연결되는 핵심 경제 개념 쏙쏙!
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {concepts.map((c, idx) => (
            <div key={idx} className={`p-4 sm:p-5 rounded-2xl border ${c.color} space-y-2`}>
              <div className="flex items-center gap-2">
                {c.icon}
                <h4 className="font-jua text-base sm:text-lg text-slate-900">{c.title}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {c.description}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs font-bold text-slate-800">
                📌 {c.formula}
              </div>
              <p className="text-xs text-slate-600 pl-1">
                💡 <strong>활동 연결:</strong> {c.lesson}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer hover:bg-slate-800 transition-colors"
          >
            이해했어요! 수업 활동 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
