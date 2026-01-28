
import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Category, User } from './types';
import ActivityCard from './components/ActivityCard';
import Navbar from './components/Navbar';
import CreateActivityModal from './components/CreateActivityModal';
import AdminLoginModal from './components/AdminLoginModal';

const MOCK_USER: User = {
  id: 'user_123',
  name: 'Invitado',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
};

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Yoga en el Retiro',
    description: 'Sesión matutina de yoga para todos los niveles frente al estanque.',
    date: '2024-05-20',
    time: '09:00',
    location: 'Parque del Retiro, Madrid',
    category: Category.SPORT,
    maxParticipants: 15,
    participants: ['u1', 'u2'],
    creatorId: 'admin',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  }
];

const App: React.FC = () => {
  // CARGA AUTOMÁTICA: Al abrir la app, intentamos leer lo que guardamos antes
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('actihub_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [filter, setFilter] = useState<Category | 'All'>('All');

  // GUARDADO AUTOMÁTICO: Cada vez que cambien las actividades, se guardan en el navegador
  useEffect(() => {
    localStorage.setItem('actihub_activities', JSON.stringify(activities));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (filter === 'All') return activities;
    return activities.filter(a => a.category === filter);
  }, [activities, filter]);

  const handleCreateOrUpdate = (data: Omit<Activity, 'id' | 'participants' | 'creatorId'>) => {
    if (editingActivity) {
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...data } : a));
    } else {
      const newAct: Activity = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        participants: [],
        creatorId: 'admin',
      };
      setActivities(prev => [newAct, ...prev]);
    }
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleJoin = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        if (act.participants.includes(MOCK_USER.id)) {
          return { ...act, participants: act.participants.filter(p => p !== MOCK_USER.id) };
        }
        if (act.participants.length < act.maxParticipants) {
          return { ...act, participants: [...act.participants, MOCK_USER.id] };
        }
      }
      return act;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        user={MOCK_USER} 
        isAdmin={isAdmin} 
        onAdminClick={() => isAdmin ? setIsAdmin(false) : setIsAdminLoginOpen(true)} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              Actividades Disponibles
              {isAdmin && <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter font-black">Admin Panel</span>}
            </h1>
            <p className="text-slate-500 mt-1">Organiza y gestiona tus eventos de formación.</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', ...Object.values(Category)].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === cat 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {cat === 'All' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              currentUserId={MOCK_USER.id}
              isAdmin={isAdmin}
              onJoin={handleJoin}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {isAdmin && (
        <button 
          onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 active:scale-95 z-40 border-4 border-white"
          title="Nueva Actividad"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {isModalOpen && (
        <CreateActivityModal 
          onClose={() => { setIsModalOpen(false); setEditingActivity(null); }} 
          onSubmit={handleCreateOrUpdate}
          initialData={editingActivity}
        />
      )}

      {isAdminLoginOpen && (
        <AdminLoginModal 
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={() => { setIsAdmin(true); setIsAdminLoginOpen(false); }}
        />
      )}
    </div>
  );
};

export default App;
