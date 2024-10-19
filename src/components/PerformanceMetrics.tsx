import React from 'react';
import { BarChart } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: {
    psnr: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="mt-8 bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart className="mr-2" size={24} />
        Performance Metrics
      </h3>
      <div>
        <p>Peak Signal-to-Noise Ratio (PSNR): {metrics.psnr.toFixed(2)} dB</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;