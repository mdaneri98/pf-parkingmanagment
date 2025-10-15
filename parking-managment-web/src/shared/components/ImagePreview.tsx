import { useState } from 'react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export function ImagePreview({ 
  src, 
  alt, 
  className = '', 
  size = 'md',
  clickable = true
}: ImagePreviewProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  
  console.log('ImagePreview Debug:', { src, alt, size });

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const baseClasses = `${sizeClasses[size]} object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 ${
    clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
  } transition-opacity`;

  return (
    <>
      <div className="shrink-0 flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className={`${baseClasses} ${className}`}
          onClick={clickable ? () => setShowImageModal(true) : undefined}
          onLoad={() => console.log('ImagePreview: Image loaded successfully')}
          onError={(e) => {
            console.log('ImagePreview: Image failed to load', src);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
