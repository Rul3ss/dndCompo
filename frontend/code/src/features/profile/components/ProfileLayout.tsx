import ProfileForm from './ProfileForm';
import SidebarAvatar from './SidebarAvatar';
import Navbar from '../../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Bell, ChevronRight } from 'lucide-react';

export default function ProfileLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'general', label: 'Perfil Geral', icon: <User className="w-4 h-4" />, active: true },
    { id: 'security', label: 'Segurança', icon: <Shield className="w-4 h-4" />, badge: 'Em breve' },
    { id: 'notifications', label: 'Notificações', icon: <Bell className="w-4 h-4" />, badge: 'Em breve' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#e8d5b0] font-inter">
      <Navbar 
        onSignInSelect={() => navigate('/login')}
        onCreateAccountSelect={() => navigate('/register')}
      />
      
      <main className="pt-[120px] pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-cinzel text-3xl font-bold text-[#c9a84c] tracking-wider mb-2">
              Santuário do Herói
            </h1>
            <p className="text-[#a89070] text-sm">
              Gerencie sua identidade e segredos dentro do reino.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1510]/40 backdrop-blur-md border border-[#c9a84c]/10 rounded-2xl p-6 sticky top-[120px]"
            >
              <SidebarAvatar />
              
              <nav className="mt-8 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    disabled={!item.active}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                      item.active 
                        ? 'bg-[#c9a84c]/10 text-[#e8d5b0] border border-[#c9a84c]/20' 
                        : 'text-[#6b5a3e] opacity-60 cursor-not-allowed hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={item.active ? 'text-[#c9a84c]' : 'text-[#4a3820]'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium tracking-wide font-cinzel">
                        {item.label}
                      </span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] uppercase bg-[#0c0a08] px-1.5 py-0.5 rounded border border-[#c9a84c]/10 text-[#c9a84c]/60">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`w-4 h-4 transition-transform ${item.active ? 'text-[#c9a84c] group-hover:translate-x-1' : 'text-transparent'}`} />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-10 pt-6 border-t border-[#c9a84c]/10">
                <div className="p-4 bg-gradient-to-br from-[#c9a84c]/5 to-transparent rounded-xl border border-[#c9a84c]/5">
                  <p className="text-[10px] text-[#c9a84c] font-cinzel font-bold mb-1 tracking-widest uppercase">Rank do Aventureiro</p>
                  <p className="text-[#e8d5b0] text-xs font-medium">Iniciante das Crônicas</p>
                </div>
              </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1510]/60 backdrop-blur-xl border border-[#c9a84c]/20 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="p-8 md:p-12">
                <ProfileForm />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
