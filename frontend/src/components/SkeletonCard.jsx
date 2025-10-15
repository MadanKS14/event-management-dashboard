// src/components/SkeletonCard.jsx

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="bg-[#122142] rounded-xl shadow-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">
          <Skeleton width={200} baseColor="#1F294A" highlightColor="#374151" />
        </h3>
      </div>
      <p className="text-sm mb-4">
        <Skeleton count={2} baseColor="#1F294A" highlightColor="#374151" />
      </p>
      <div className="space-y-3 mb-6">
        <p><Skeleton width={150} baseColor="#1F294A" highlightColor="#374151" /></p>
        <p><Skeleton width={180} baseColor="#1F294A" highlightColor="#374151" /></p>
      </div>
      <div>
        <Skeleton height={10} baseColor="#1F294A" highlightColor="#374151" />
      </div>
    </div>
  );
};

export default SkeletonCard;