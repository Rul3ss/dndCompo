import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { API_BASE_URL } from '../../../lib/config';
import AvatarCropModal from './AvatarCropModal';
import { Camera, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function SidebarAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (e: Event) => {
      const { name } = (e as CustomEvent).detail;
      setName(name);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient(`${API_BASE_URL}/user/me`);
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl || '');
        setName(data.name || 'Aventureiro');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarClick = () => {
    if (!loadingFile) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setCropSrc(objectUrl);
      e.target.value = '';
    }
  };

  const handleCropConfirm = async (croppedBlob: Blob) => {
    setCropSrc(null);
    setLoadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', croppedBlob, 'avatar.jpg');
      const avatarRes = await apiClient(`${API_BASE_URL}/user/avatar`, {
        method: 'POST',
        body: formData
      });
      
      const avatarData = await avatarRes.json().catch(() => null);
      
      if (avatarRes.ok) {
        setAvatarUrl(avatarData.avatarUrl);
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: { avatarUrl: avatarData.avatarUrl } }));
      } else {
        alert('Falha ao canalizar imagem: ' + (avatarData?.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar a imagem pelo portal.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {cropSrc && (
          <AvatarCropModal
            imageSrc={cropSrc}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
          />
        )}
      </AnimatePresence>
      
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#c9a84c] to-[#a07830] rounded-full opacity-30 group-hover:opacity-60 blur transition duration-300"></div>
        
        <div 
          onClick={handleAvatarClick}
          className={`relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 bg-[#0c0a08] cursor-pointer transition-all duration-300 group-hover:border-[#c9a84c] ${loadingFile ? 'animate-pulse' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar do usuário" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1510] to-[#0c0a08] text-[#c9a84c] text-4xl font-cinzel font-bold uppercase transition-transform duration-500 group-hover:scale-110">
              {name.charAt(0)}
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {loadingFile ? (
              <Loader2 className="w-8 h-8 text-[#e8d5b0] animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-[#e8d5b0]" />
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="font-cinzel text-[#e8d5b0] font-bold text-lg truncate max-w-[200px]">
          {name}
        </h3>
        <p className="text-[#a89070] text-[10px] uppercase tracking-[0.2em] font-medium opacity-60">
          Signatário do Reino
        </p>
      </div>
    </div>
  );
}
