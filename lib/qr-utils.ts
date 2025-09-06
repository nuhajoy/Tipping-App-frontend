import QRCode from 'qrcode';

export interface QRCodeData {
  employeeCode: string;
  employeeName: string;
  businessName: string;
  platform: string;
}

export async function generateQRCode(data: QRCodeData): Promise<string> {
  try {
    const qrText = JSON.stringify({
      code: data.employeeCode,
      name: data.employeeName,
      business: data.businessName,
      app: 'TipTop'
    });
    
    const qrCodeUrl = await QRCode.toDataURL(qrText, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function shareQRCode(qrCodeUrl: string, employeeName: string) {
  if (navigator.share) {
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `${employeeName}-tip-code.png`, { type: 'image/png' });
      
      await navigator.share({
        title: 'My TipTop Code',
        text: `Send me a tip using TipTop! Scan this QR code or use my code.`,
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      fallbackShare(qrCodeUrl, employeeName);
    }
  } else {
    fallbackShare(qrCodeUrl, employeeName);
  }
}

function fallbackShare(qrCodeUrl: string, employeeName: string) {
  // Create a temporary link for download
  const link = document.createElement('a');
  link.href = qrCodeUrl;
  link.download = `${employeeName}-tip-code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}