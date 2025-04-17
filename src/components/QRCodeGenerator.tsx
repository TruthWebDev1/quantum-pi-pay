
import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  className,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // In a real implementation, we would use a QR code library
    // For the MVP, we'll fake it with a placeholder
    
    // This approach simulates QR code generation
    // In production, use a proper QR code library
    const generateQRCode = () => {
      // For demo purposes, we're generating a placeholder image
      // In a real app, we'd generate an actual QR code
      
      const params = new URLSearchParams({
        data: encodeURIComponent(value),
        size: `${size}x${size}`,
        color: fgColor.replace('#', ''),
        bgcolor: bgColor.replace('#', ''),
      });
      
      // This is a fake URL that simulates QR code generation
      // In a real app, use a QR code library instead
      const url = `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
      
      setQrCodeUrl(url);
    };
    
    if (value) {
      generateQRCode();
    }
  }, [value, size, bgColor, fgColor, level]);

  if (!value) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <QrCode size={size/3} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {qrCodeUrl ? (
        <img 
          src={qrCodeUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="rounded-lg"
        />
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse" 
          style={{ width: size, height: size }}
        >
          <QrCode size={size/3} className="text-gray-400" />
        </div>
      )}
      <div className="absolute inset-0 rounded-lg shadow-inner"></div>
    </div>
  );
};

export default QRCodeGenerator;
