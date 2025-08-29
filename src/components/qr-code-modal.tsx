'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { generateQRCode, shareQRCode } from '@/lib/qr-utils';
import { Share2, Download, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const { employee } = useAuthStore();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && employee && !qrCodeUrl) {
      generateQR();
    }
  }, [isOpen, employee]);

  const generateQR = async () => {
    if (!employee) return;
    
    setIsGenerating(true);
    try {
      const qrCode = await generateQRCode({
        employeeCode: employee.uniqueCode,
        employeeName: employee.name,
        businessName: employee.businessName,
        platform: 'TipTop'
      });
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!qrCodeUrl || !employee) return;
    
    try {
      await shareQRCode(qrCodeUrl, employee.name);
      toast.success('QR code shared successfully!');
    } catch (error) {
      console.error('Failed to share QR code:', error);
      toast.error('Failed to share QR code');
    }
  };

  const copyCode = async () => {
    if (!employee) return;
    
    try {
      await navigator.clipboard.writeText(employee.uniqueCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Your Tip Code
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Share this QR code or unique code with customers to receive tips
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <Card className="border-2 border-dashed border-[#71FF71]/30 bg-[#71FF71]/5">
            <CardContent className="flex flex-col items-center justify-center p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#71FF71]" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">Generating QR Code...</p>
                </div>
              ) : qrCodeUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <img src={qrCodeUrl} alt="Employee QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    Customers can scan this code to tip you instantly
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Failed to generate QR code</p>
              )}
            </CardContent>
          </Card>

          {/* Unique Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Your Unique Code
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-8 px-3 hover:bg-[#71FF71]/10"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                {employee?.uniqueCode}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-[#71FF71] hover:bg-[#5eeb5e] text-gray-900 font-medium"
              disabled={!qrCodeUrl}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}