import React from 'react';

const HomeContent = () => (
  <>
    <div className="mb-6 p-6 bg-gradient-to-br from-[#232326] to-[#18181b] rounded-2xl shadow-lg text-base text-gray-200 border border-[#2d2d30]">
      <div className="mb-2 text-2xl font-extrabold text-blue-200 tracking-tight">FOSSistant</div>
      <div className="mb-3 text-lg font-semibold text-gray-100">
        오픈소스 이슈에 <span className="text-blue-300 font-bold">난이도 라벨</span>을 부여해<br />
        <span className="text-blue-400 font-bold">초심자도 쉽게 도전할 수 있는 이슈</span>를 한눈에 찾을 수 있도록 도와줍니다.
      </div>
      <hr className="my-4 border-gray-700" />
      <div className="mb-2 text-base text-gray-300 font-semibold">이 서비스를 통해 얻을 수 있는 점</div>
      <ul className="list-disc list-inside text-gray-300 space-y-1 pl-2">
        <li><span className="text-blue-200 font-bold">난이도별로 분류된 이슈</span>를 통해 <span className="font-semibold">자신에게 맞는 첫 기여</span>를 쉽게 찾을 수 있습니다.</li>
        <li>단계별 기여 가이드로 오픈소스 참여 과정을 <span className="font-semibold">처음부터 끝까지 안내</span>받을 수 있습니다.</li>
        <li>커뮤니티의 라벨링 참여로 <span className="font-semibold">더 많은 초심자</span>가 오픈소스에 진입할 수 있습니다.</li>
        <li>경험자들은 직접 라벨링에 참여해 <span className="font-semibold">오픈소스 생태계 성장</span>에 기여할 수 있습니다.</li>
      </ul>
      <div className="mt-5 text-center text-base font-semibold text-blue-300">FOSSistant와와 함께 오픈소스의 첫걸음을 시작해보세요!</div>
    </div>
  </>
);

export default HomeContent; 