import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

interface DenoiseControlsProps {
  onProcess: (processType: string, params: any) => void;
  isProcessing: boolean;
}

const DenoiseControls: React.FC<DenoiseControlsProps> = ({ onProcess, isProcessing }) => {
  const [method, setMethod] = useState('nlm');
  const [strength, setStrength] = useState(50);

  const handleProcess = () => {
    onProcess('denoise', { method, strength });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Denoising Controls</h3>
      <div className="mb-4">
        <label className="block mb-2">Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="nlm">Non-Local Means</option>
          <option value="wavelet">Wavelet</option>
          <option value="tv">Total Variation</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Strength: {strength}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={strength}
          onChange={(e) => setStrength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        onClick={handleProcess}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        disabled={isProcessing}
      >
        <Sliders className="mr-2" size={20} />
        {isProcessing ? 'Processing...' : 'Apply Denoising'}
      </button>
    </div>
  );
};

export default DenoiseControls;