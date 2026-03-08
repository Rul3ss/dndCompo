import { useEffect, useRef, useState } from 'react';

// Importa todas as imagens da pasta assets/homepage como suas URLs resultantes
const imageModules = import.meta.glob('../../../assets/homepage/*.jpg', { eager: true, query: '?url', import: 'default' });

// Extrai as URLs na ordem correta
const imageUrls: string[] = Object.values(imageModules).map(mod => mod as string);

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const requestRef = useRef<number>(0);
  const frameIndexRef = useRef(0);

  // Pré-carrega todas as imagens
  useEffect(() => {
    let isCancelled = false;
    
    const loadImages = async () => {
      const promises = imageUrls.map(url => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
      });

      try {
        const images = await Promise.all(promises);
        if (!isCancelled) {
          setLoadedImages(images);
        }
      } catch (error) {
        console.error("Erro ao carregar imagens do fundo animado:", error);
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Loop de Animação
  useEffect(() => {
    if (loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    // Reduzido para aproximadamente 12 frames por segundo (1000ms / 12 ≈ 83.3ms) para deixar mais lento e suave.
    // Para deixar ainda mais lento, diminua o número '12'. Para mais rápido, aumente.
    const fpsInterval = 1000 / 15;

    const renderFrame = (time: number) => {
      requestRef.current = requestAnimationFrame(renderFrame);

      const elapsed = time - lastTime;

      // Se passou tempo suficiente, desenha o próximo frame
      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);

        // Ajusta o tamanho do canvas para corresponder ao tamanho da janela
        const renderWidth = window.innerWidth;
        const renderHeight = window.innerHeight;

        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
          canvas.width = renderWidth;
          canvas.height = renderHeight;
        }

        const img = loadedImages[frameIndexRef.current];
        
        // Desenha a imagem preenchendo a tela (simula aspect ratio 'cover')
        const imgRatio = img.width / img.height;
        const canvasRatio = renderWidth / renderHeight;
        
        let drawWidth = renderWidth;
        let drawHeight = renderHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = renderWidth / imgRatio;
          offsetY = (renderHeight - drawHeight) / 2;
        } else {
          drawWidth = renderHeight * imgRatio;
          offsetX = (renderWidth - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, renderWidth, renderHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Avança o frame
        frameIndexRef.current = (frameIndexRef.current + 1) % loadedImages.length;
      }
    };

    requestRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loadedImages]);

  // Se as imagens não carregaram, mantém um fundo preto ou o canvas vazio.
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
