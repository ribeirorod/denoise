import React from 'react';

interface ImagePreviewProps {
  image: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image }) => {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
      <img src={image} alt="Preview" className="max-w-full max-h-full object-contain" />
    </div>
  );
};

export default ImagePreview;