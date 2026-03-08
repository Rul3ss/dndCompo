import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { API_BASE_URL } from '../../../lib/config';
import AvatarCropModal from './AvatarCropModal';

export default function SidebarAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient(`${API_BASE_URL}/user/me`);
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl || '');
        setName(data.name || 'User');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarClick = () => {
    if (!loadingFile) fileInputRef.current?.click();
  };

  // Ao selecionar arquivo, abre o modal de crop em vez de fazer upload imediato
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setCropSrc(objectUrl);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = '';
    }
  };

  // Chamado ao confirmar o crop no modal — recebe o Blob da imagem recortada
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
        alert('Falha ao fazer upload da imagem: ' + (avatarData?.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar a imagem.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  return (
    <>
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className="sidebar-avatar-container">
        <div 
          className={`sidebar-avatar clickable-avatar ${loadingFile ? 'loading' : ''}`} 
          onClick={handleAvatarClick} 
          title="Clique para alterar a foto"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar do usuário" />
          ) : (
            <div className="avatar-placeholder">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="avatar-overlay">
            <span>{loadingFile ? '⏳' : '📷'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
