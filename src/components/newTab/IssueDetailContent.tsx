import React from 'react';

const IssueDetailContent = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">이슈 상세 안내</h2>
    <p className="text-gray-300 mb-4">
      이슈 상세 페이지에서는 이슈의 본문과 메타데이터를 분석하여 <strong>예측 난이도</strong>, <strong>핵심 설명</strong>, <strong>유의점</strong>을 자동으로 제공합니다.<br />
      <span className="text-blue-200 font-semibold mb-2">예측 난이도</span>는 해당 이슈가 얼마나 도전적인지 미리 가늠할 수 있게 도와주며,<br />
      <span className="text-blue-200 font-semibold mb-2">핵심 설명</span>은 이슈의 본질을 빠르게 파악할 수 있도록 요약해줍니다.<br />
      <span className="text-blue-200 font-semibold mb-2">유의점</span>은 작업 시 주의해야 할 부분이나 참고할 만한 정보를 제공합니다.<br />
      사용자는 별도의 검색이나 분석 없이도 <span className="text-blue-200 font-semibold">쉽게 실마리를 잡고</span> 기여를 시작할 수 있습니다.
    </p>
    <ul className="list-disc list-inside text-gray-300 mt-4  space-y-2">
      <li>이슈의 주요 내용과 맥락을 한눈에 파악</li>
      <li>예상 난이도에 따라 도전 여부를 쉽게 결정</li>
      <li>기여 시 주의해야 할 점까지 미리 확인</li>
    </ul>

    <div className="mb-4 p-4 bg-[#232326] rounded shadow text-base text-gray-200 border border-[#2d2d30]">
      <span className="font-semibold text-gray-100">이슈 상세 페이지</span>에서는 <strong>예측 난이도</strong>, <strong>이슈에 대한 설명</strong>, <strong>유의점</strong> 정보를 확인할 수 있습니다.<br />
      <span className="font-semibold text-blue-300">직접 이슈에 라벨을 붙여 난이도 조절에 기여</span>할 수도 있습니다.<br />
      <span className="text-xs text-gray-400">초심자와 경험자 모두의 참여가 오픈소스 생태계에 큰 힘이 됩니다.</span>
    </div>

  </div>
);

export default IssueDetailContent;