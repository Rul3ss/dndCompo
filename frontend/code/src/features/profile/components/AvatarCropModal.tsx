import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, X, Check, Loader2 } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AvatarCropModalProps {
  imageSrc: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
  cropShape?: 'round' | 'rect';
}

// Gera o blob cropado usando Canvas API
async function getCroppedImage(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const outputSize = 400; // tamanho de saída do avatar
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Falha ao gerar imagem cropada'));
    }, 'image/jpeg', 0.92);
  });
}

export default function AvatarCropModal({ imageSrc, onConfirm, onCancel, cropShape = 'round' }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: unknown, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-[#0c0a08]/90 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#1a1510] border border-[#c9a84c]/20 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="p-6 border-b border-[#c9a84c]/10 flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-xl font-bold text-[#e8d5b0]">Refinar Retrato</h3>
            <p className="text-[#a89070] text-[10px] uppercase tracking-wider font-medium opacity-70">Ajuste seu semblante no reino</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-[#4a3820] hover:text-[#c9a84c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-[340px] bg-[#0c0a08]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            classes={{
              containerClassName: "bg-[#0c0a08]",
              mediaClassName: "bg-[#0c0a08]",
              cropAreaClassName: "border-2 border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.2)]"
            }}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-[#4a3820]" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 h-1 bg-[#2a1f0f] rounded-lg appearance-none cursor-pointer accent-[#c9a84c]"
              style={{
                backgroundImage: `linear-gradient(to right, #c9a84c 0%, #c9a84c ${(zoom - 1) / 2 * 100}%, #2a1f0f ${(zoom - 1) / 2 * 100}%, #2a1f0f 100%)`
              }}
            />
            <ZoomIn className="w-4 h-4 text-[#4a3820]" />
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="flex-1 py-3 px-4 rounded-xl border border-[#3d2e1a] text-[#a89070] font-cinzel text-xs font-bold tracking-widest hover:bg-white/5 transition-all"
              onClick={onCancel}
              disabled={processing}
            >
              DESCARTAR
            </button>
            <button 
              className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] font-cinzel text-xs font-bold tracking-widest shadow-[0_10px_20px_rgba(201,168,76,0.2)] hover:shadow-[0_15px_30px_rgba(201,168,76,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  INCANTANDO...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  CONFIRMAR VISUAL
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
