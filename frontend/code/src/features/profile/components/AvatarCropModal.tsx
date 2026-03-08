import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';

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
}

// Gera o blob cropado usando Canvas API
async function getCroppedImage(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob());
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

export default function AvatarCropModal({ imageSrc, onConfirm, onCancel }: AvatarCropModalProps) {
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

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={e => e.stopPropagation()}>
        <h3 className="crop-modal-title">Ajustar foto de perfil</h3>
        <p className="crop-modal-subtitle">Arraste para reposicionar · Scroll para dar zoom</p>

        <div className="crop-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-zoom-control">
          <span>🔍</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="crop-zoom-slider"
          />
          <span>🔎</span>
        </div>

        <div className="crop-actions">
          <button className="btn-crop-cancel" onClick={onCancel} disabled={processing}>
            Cancelar
          </button>
          <button className="btn-crop-confirm" onClick={handleConfirm} disabled={processing}>
            {processing ? 'Processando...' : 'Salvar foto'}
          </button>
        </div>
      </div>
    </div>
  );
}
