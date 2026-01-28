
import React, { useState } from 'react';
import { Category, Activity } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CreateActivityModalProps {
  onClose: () => void;
  onSubmit: (activity: Omit<Activity, 'id' | 'participants' | 'creatorId'>) => void;
  initialData?: Activity | null;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    location: initialData?.location || '',
    category: initialData?.category || Category.SPORT,
    maxParticipants: initialData?.maxParticipants || 10,
    imageUrl: initialData?.imageUrl || ''
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchImage = async () => {
    const query = searchTerm || formData.title;
    if (!query) return alert('Introduce un título o término de búsqueda');
    
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview", // Usamos pro para mejor calidad de búsqueda
        contents: `Encuentra una URL de imagen directa (JPG o PNG) de alta calidad en internet para una actividad de: ${query}. Responde únicamente con la URL de la imagen encontrada.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text;
      // Intento de extraer una URL del texto
      const urlRegex = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|webp|gif))/i;
      const match = text?.match(urlRegex);

      if (match && match[0]) {
        setFormData(prev => ({ ...prev, imageUrl: match[0] }));
      } else {
        // Fallback: Si no devuelve una URL directa en el texto, buscamos en los grounding chunks
        const firstChunk = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0];
        if (firstChunk?.web?.uri) {
           // Si es una web, al menos avisamos, pero intentamos que gemini dé el link directo
           alert('He encontrado resultados pero necesito una URL directa de imagen. Prueba con otro término.');
        } else {
           alert('No he podido encontrar una imagen directa. Por favor, introduce una URL manualmente.');
        }
      }
    } catch (error) {
      console.error('Error searching image:', error);
      alert('Error en la búsqueda. Prueba introduciendo una URL manual.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert('Debes seleccionar una imagen para la actividad.');
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Modificar Actividad' : 'Publicar Nueva Actividad'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Image Search & Preview Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Imagen de la actividad</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Buscar imagen por título o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <button 
                type="button"
                onClick={searchImage}
                disabled={isSearching}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="relative h-52 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-100 group">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                  <svg className="w-10 h-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">Usa el buscador o pega una URL abajo para ver la imagen aquí.</p>
                </div>
              )}
              {isSearching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Buscando imagen...</span>
                  </div>
                </div>
              )}
            </div>

            <input 
              type="text" 
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[10px] font-mono"
              placeholder="URL de imagen directa (https://...)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Título</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Nombre de la actividad"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Plazas Máximas</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.maxParticipants}
                onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Fecha</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Hora</label>
              <input 
                required
                type="time" 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Ubicación</label>
              <input 
                required
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Lugar o dirección exacta"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                placeholder="Detalles de la actividad..."
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            {initialData ? 'Guardar Cambios' : 'Publicar Actividad'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityModal;
