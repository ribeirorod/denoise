import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Sliders, Save } from 'lucide-react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import DenoiseControls from './components/DenoiseControls';
import EnhanceControls from './components/EnhanceControls';
import PerformanceMetrics from './components/PerformanceMetrics';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ psnr: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (image: string) => {
    setOriginalImage(image);
    setProcessedImage(null);
    setMetrics(null);
  };

  const handleImageProcess = async (processType: string, params: any) => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const imageData = originalImage.split(',')[1];
      
      const response = await axios.post(`http://localhost:5000/api/${processType}`, {
        image: imageData,
        ...params
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setProcessedImage(response.data.processed_image);
      setMetrics({ psnr: response.data.psnr });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'processed_image.png';
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Denoising and Enhancement Tool</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Original Image</h2>
          {originalImage ? (
            <ImagePreview image={originalImage} />
          ) : (
            <ImageUpload onUpload={handleImageUpload} />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Processed Image</h2>
          {processedImage ? (
            <ImagePreview image={processedImage} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-200 rounded-lg">
              <p className="text-gray-500">Process an image to see the result</p>
            </div>
          )}
        </div>
      </div>
      {originalImage && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <DenoiseControls onProcess={handleImageProcess} isProcessing={isProcessing} />
          <EnhanceControls onProcess={handleImageProcess} isProcessing={isProcessing} />
        </div>
      )}
      {metrics && <PerformanceMetrics metrics={metrics} />}
      {processedImage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveImage}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Save className="mr-2" size={20} />
            Save Processed Image
          </button>
        </div>
      )}
    </div>
  );
}

export default App;