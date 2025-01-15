import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface Props {
  emotional: number;
  intellectual: number;
  lifestyle: number;
}

const CompatibilityMetrics: React.FC<Props> = ({
  emotional,
  intellectual,
  lifestyle
}) => {
  const metrics = [
    { 
      label: 'Emotional', 
      value: emotional,
      description: 'Measures how well you connect on an emotional level'
    },
    { 
      label: 'Intellectual', 
      value: intellectual,
      description: 'Indicates alignment in thinking and communication styles'
    },
    { 
      label: 'Lifestyle', 
      value: lifestyle,
      description: 'Shows compatibility in daily routines and life goals'
    }
  ];

  return (
    <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
        <Target className="w-6 h-6 mr-2" />
        Compatibility Metrics
      </h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-800">{metric.label}</h4>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
              <span className="text-sm font-medium text-indigo-600">
                {metric.value}%
              </span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="mb-4"
            >
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompatibilityMetrics; 