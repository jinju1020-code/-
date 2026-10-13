import React, { useState } from 'react';
import { Company } from '../types';
import { Printer, X, CheckSquare, Square } from 'lucide-react';

interface WorksheetPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany?: Company;
}

export const WorksheetPrintModal: React.FC<WorksheetPrintModalProps> = ({
  isOpen,
  onClose,
  currentCompany,
}) => {
  const [blankMode, setBlankMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const c = currentCompany;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (No print) */}
        <div className="no-print flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-jua text-xl text-slate-900">
              수업 활동지 인쇄 및 확인 (공개수업용)
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBlankMode(false)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  !blankMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-700'
                }`}
              >
                작성된 내용 포함
              </button>
              <button
                type="button"
                onClick={() => setBlankMode(true)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  blankMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-700'
                }`}
              >
                빈 활동지 (학생 배부용)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>활동지 인쇄하기</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Worksheet Body (Exact visual replica of uploaded image) */}
        <div className="border-2 border-black p-4 sm:p-6 bg-white text-black font-sans select-text">
          {/* Top Header Box */}
          <div className="border-2 border-black flex flex-wrap justify-between items-center p-3 mb-4">
            <div className="text-center flex-1">
              <h2 className="font-black text-xl sm:text-2xl tracking-tight">
                ★우리 회사의 선택! 소비자의 마음을 잡아라!(기업)
              </h2>
            </div>
            <div className="border-l-2 border-black pl-4 py-1 flex items-center gap-3 text-sm font-bold min-w-[200px]">
              <div>
                6학년 {blankMode ? '___' : (c?.grade || '6')}반 {blankMode ? '___' : (c?.classNum || '1')}반 {blankMode ? '___' : (c?.groupNum || '1')}모둠
              </div>
              <div>
                이름: {blankMode ? '________' : (c?.studentNames || '')}
              </div>
            </div>
          </div>

          {/* Mission Description */}
          <div className="text-xs sm:text-sm font-semibold mb-3 leading-relaxed">
            여러분은 햄버거를 만들고 판매하는 기업입니다. 모든 기업에는 100만 원의 투자 비용이 있습니다. 아래 조건을 확인하고 소비자들에게 많이 팔릴 수 있는 햄버거를 만들어 봅시다.
          </div>

          {/* Conditions Box */}
          <div className="border border-black p-3 mb-5 text-xs sm:text-sm">
            <div className="text-center font-bold mb-2">〈 조 건 〉</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">□</span>
                <span>투자 비용은 전액 모두 사용해야 한다.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">□</span>
                <span>투자 비용을 고려하여 제품의 적절한 가격을 책정한다.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">□</span>
                <span>어떤 분야에 얼마나 투자할지는 모둠 협의를 통해 정한다.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">□</span>
                <span>모둠 협의를 통해 합의된 내용으로 작성한다.</span>
              </div>
            </div>
          </div>

          {/* 1번 문항 */}
          <div className="mb-6 space-y-2">
            <div className="text-xs sm:text-sm font-bold">
              1. 아래 제품의 조건 중 우리 기업에서 어떤 부분에 얼마나 투자하여 제품을 만들지 모둠 친구들과 함께 토의 후 작성해 봅시다.
              <span className="block text-[11px] font-normal text-slate-700">
                (※ 정답은 없습니다. 우리 회사가 중요하다고 생각하는 곳에 자유롭게 투자합니다.)
              </span>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-sky-100/70 border-b border-black">
                  <th className="border border-black p-2 w-20">분야</th>
                  <th className="border border-black p-2">내용</th>
                  <th className="border border-black p-2 w-24">투자 비용</th>
                  <th className="border border-black p-2 w-1/3">왜 이렇게 정했나요?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">맛·품질</td>
                  <td className="border border-black p-2">신상품 개발 및 좋은 품질의 제품(맛, 유기농 재료, 완성도 등)을 만들기 위해 드는 비용</td>
                  <td className="border border-black p-2 text-center font-bold">
                    {blankMode ? '' : (c?.investments.tasteQuality ?? 20)} 만원
                  </td>
                  <td className="border border-black p-2">
                    {blankMode ? '' : (c?.reasons.tasteQuality || '')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">디자인</td>
                  <td className="border border-black p-2">제품 패키지(포장지), 햄버거 모양, 로고 등 제품과 브랜드를 매력적으로 보이게 하는 데 쓰는 비용</td>
                  <td className="border border-black p-2 text-center font-bold">
                    {blankMode ? '' : (c?.investments.design ?? 20)} 만원
                  </td>
                  <td className="border border-black p-2">
                    {blankMode ? '' : (c?.reasons.design || '')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">서비스</td>
                  <td className="border border-black p-2">배달 및 쿠폰·굿즈, 주문의 편의성(배달 앱 사용 여부 등), 고객 응대 등에 드는 비용</td>
                  <td className="border border-black p-2 text-center font-bold">
                    {blankMode ? '' : (c?.investments.service ?? 20)} 만원
                  </td>
                  <td className="border border-black p-2">
                    {blankMode ? '' : (c?.reasons.service || '')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">가격 경쟁력</td>
                  <td className="border border-black p-2">할인, 쿠폰, 세트 구성 등을 활용하여 소비자가 부담하기 좋은 가격을 만드는 데 드는 비용</td>
                  <td className="border border-black p-2 text-center font-bold">
                    {blankMode ? '' : (c?.investments.priceCompetitiveness ?? 20)} 만원
                  </td>
                  <td className="border border-black p-2">
                    {blankMode ? '' : (c?.reasons.priceCompetitiveness || '')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">광고</td>
                  <td className="border border-black p-2">광고 모델, 광고 문구, 홍보 방법 등에 대한 비용</td>
                  <td className="border border-black p-2 text-center font-bold">
                    {blankMode ? '' : (c?.investments.advertising ?? 20)} 만원
                  </td>
                  <td className="border border-black p-2">
                    {blankMode ? '' : (c?.reasons.advertising || '')}
                  </td>
                </tr>
                <tr className="bg-sky-50 font-bold">
                  <td colSpan={2} className="border border-black p-2 text-center">합계</td>
                  <td className="border border-black p-2 text-center">100만원</td>
                  <td className="border border-black p-2 bg-slate-100"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2번 문항 */}
          <div className="space-y-2">
            <div className="text-xs sm:text-sm font-bold">
              2. 모둠 친구들과 함께 우리 회사의 이름과 제품의 이름, 판매 가격을 정해 봅시다.
            </div>

            <table className="w-full border-collapse border border-black text-xs">
              <tbody>
                <tr>
                  <td className="border border-black p-2 bg-sky-100/70 font-bold text-center w-28">회사 이름</td>
                  <td className="border border-black p-2 font-bold">
                    {blankMode ? '' : (c?.companyName || '')}
                  </td>
                  <td rowSpan={3} className="border border-black p-2 bg-sky-100/70 font-bold text-center w-36 align-top">
                    ▼ 제품의 최종 가격
                    <div className="mt-4 font-black text-base text-black">
                      {blankMode ? '_______ 원' : `${c?.price?.toLocaleString() || '6,000'} 원`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 bg-sky-100/70 font-bold text-center">제품 이름</td>
                  <td className="border border-black p-2 font-bold">
                    {blankMode ? '' : (c?.productName || '')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 bg-sky-100/70 font-bold text-center">
                    가장 많이<br />투자한 분야
                  </td>
                  <td className="border border-black p-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold underline">
                        {blankMode ? '________' : (c?.mainFocus === 'tasteQuality' ? '맛·품질' : c?.mainFocus === 'design' ? '디자인' : c?.mainFocus === 'service' ? '서비스' : c?.mainFocus === 'priceCompetitiveness' ? '가격 경쟁력' : '광고')}
                      </span>
                      <span className="text-slate-500 font-bold">그 이유:</span>
                      <span>{blankMode ? '' : (c?.reasons.mainFocusReason || '')}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
