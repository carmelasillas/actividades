
import React from 'react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  currentUserId: string;
  isAdmin: boolean;
  onJoin: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, currentUserId, isAdmin, onJoin, onEdit, onDelete }) => {
  const isJoined = activity.participants.includes(currentUserId);
  const isFull = activity.participants.length >= activity.maxParticipants;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col h-full relative">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={activity.imageUrl} 
          alt={activity.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {activity.category}
          </span>
        </div>
        
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => onEdit(activity)}
              className="p-2 bg-white/90 backdrop-blur rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(activity.id)}
              className="p-2 bg-white/90 backdrop-blur rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{activity.title}</h3>
          <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">{activity.description}</p>
        </div>

        <div className="space-y-2 mb-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(activity.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} • {activity.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="line-clamp-1">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className={isFull ? 'text-red-500 font-medium' : ''}>
              {activity.participants.length} / {activity.maxParticipants} apuntados
            </span>
          </div>
        </div>

        <button
          disabled={!isJoined && isFull}
          onClick={() => onJoin(activity.id)}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            isJoined 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : isFull 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
          }`}
        >
          {isJoined ? 'Desapuntarme' : isFull ? 'Lleno' : '¡Me apunto!'}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
