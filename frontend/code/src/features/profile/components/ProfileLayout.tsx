import ProfileForm from './ProfileForm';
import SidebarAvatar from './SidebarAvatar';
import Navbar from '../../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

export default function ProfileLayout() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <Navbar 
        onSignInSelect={() => navigate('/login')}
        onCreateAccountSelect={() => navigate('/register')}
      />
      <div className="profile-content">
        <aside className="profile-sidebar">
          <SidebarAvatar />
          <ul>
            <li className="active">Perfil Geral</li>
            <li>Segurança (Em breve)</li>
            <li>Notificações (Em breve)</li>
          </ul>
        </aside>
        
        <main className="profile-main">
          <ProfileForm />
        </main>
      </div>
    </div>
  );
}
