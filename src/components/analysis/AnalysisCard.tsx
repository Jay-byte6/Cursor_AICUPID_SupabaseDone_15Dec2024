import React from 'react';
import { Brain, Heart, Target, Shield, Activity, Ban } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  score: number;
  metrics: Array<{
    label: string;
    value: number;
  }>;
  insights: string[];
  onTakeTest: () => void;
  icon: 'personality' | 'preferences' | 'psychological' | 'goals' | 'behavioral' | 'dealbreakers';
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  score,
  metrics,
  insights,
  onTakeTest,
  icon
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'personality':
        return <Brain className="w-6 h-6 text-pink-500" />;
      case 'preferences':
        return <Heart className="w-6 h-6 text-pink-500" />;
      case 'psychological':
        return <Activity className="w-6 h-6 text-pink-500" />;
      case 'goals':
        return <Target className="w-6 h-6 text-pink-500" />;
      case 'behavioral':
        return <Shield className="w-6 h-6 text-pink-500" />;
      case 'dealbreakers':
        return <Ban className="w-6 h-6 text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-pink-50 rounded-lg">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-pink-500">{score}%</div>
            <div className="text-sm text-gray-500">Completion</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{metric.label}</span>
              <span className="text-gray-900 font-medium">{metric.value}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onTakeTest}
        className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Take Assessment Test
      </button>
    </div>
  );
};

export default AnalysisCard; 