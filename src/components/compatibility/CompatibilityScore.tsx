import React from 'react';
import { Heart, Brain, Sun } from 'lucide-react';

interface Props {
  emotional: number;
  intellectual: number;
  lifestyle: number;
}

const CompatibilityScore: React.FC<Props> = ({ emotional, intellectual, lifestyle }) => {
  const formatScore = (score: number) => Math.round(score || 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-rose-50 p-4 rounded-lg text-center">
        <Heart className="w-6 h-6 text-rose-500 mx-auto mb-2" />
        <div className="text-sm font-medium text-rose-700">Emotional</div>
        <div className="text-2xl font-bold text-rose-600">{formatScore(emotional)}%</div>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg text-center">
        <Brain className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
        <div className="text-sm font-medium text-indigo-700">Intellectual</div>
        <div className="text-2xl font-bold text-indigo-600">{formatScore(intellectual)}%</div>
      </div>
      
      <div className="bg-amber-50 p-4 rounded-lg text-center">
        <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
        <div className="text-sm font-medium text-amber-700">Lifestyle</div>
        <div className="text-2xl font-bold text-amber-600">{formatScore(lifestyle)}%</div>
      </div>
    </div>
  );
};

export default CompatibilityScore;