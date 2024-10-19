import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (image: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-64 flex items-center justify-center bg-gray-200 rounded-lg">
      <label className="cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        <div className="flex flex-col items-center">
          <Upload size={48} className="text-gray-500 mb-2" />
          <span className="text-gray-500">Click to upload an image</span>
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;