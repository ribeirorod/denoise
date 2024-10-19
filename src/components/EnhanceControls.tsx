import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface EnhanceControlsProps {
  onProcess: (processType: string, params: any) => void;
  isProcessing: boolean;
}

const EnhanceControls: React.FC<EnhanceControlsProps> = ({ onProcess, isProcessing }) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [sharpness, setSharpness] = useState(0);

  const handleProcess = () => {
    onProcess('enhance', { brightness, contrast, saturation, sharpness });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Enhancement Controls</h3>
      <div className="mb-4">
        <label className="block mb-2">Brightness: {brightness}</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Contrast: {contrast}</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => setContrast(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Saturation: {saturation}</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={saturation}
          onChange={(e) => setSaturation(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Sharpness: {sharpness}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={sharpness}
          onChange={(e) => setSharpness(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        onClick={handleProcess}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        disabled={isProcessing}
      >
        <Zap className="mr-2" size={20} />
        {isProcessing ? 'Processing...' : 'Apply Enhancements'}
      </button>
    </div>
  );
};

export default EnhanceControls;