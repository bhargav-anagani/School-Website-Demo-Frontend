'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { PhotoIcon } from '@heroicons/react/24/outline';

const CATEGORIES = ['All', 'Events', 'Sports', 'Academics', 'Cultural', 'Infrastructure'];

// Placeholder images using gradient colors when no real images exist
const placeholderGallery = [
  { id:1, title:'Annual Day 2024',       category:'Events',         gradient:'from-blue-400 to-cyan-500',    icon:'🎭' },
  { id:2, title:'Science Exhibition',    category:'Academics',      gradient:'from-violet-400 to-purple-600',icon:'🔬' },
  { id:3, title:'Sports Day Champions',  category:'Sports',         gradient:'from-orange-400 to-red-500',   icon:'🏆' },
  { id:4, title:'Cultural Fest',         category:'Cultural',       gradient:'from-pink-400 to-rose-500',    icon:'🎨' },
  { id:5, title:'New Science Lab',       category:'Infrastructure', gradient:'from-emerald-400 to-teal-500', icon:'🏫' },
  { id:6, title:'Republic Day Parade',   category:'Events',         gradient:'from-amber-400 to-yellow-500', icon:'🇮🇳' },
  { id:7, title:'Chess Tournament',      category:'Sports',         gradient:'from-indigo-400 to-blue-600',  icon:'♟️' },
  { id:8, title:'Folk Dance Performance',category:'Cultural',       gradient:'from-fuchsia-400 to-pink-600', icon:'💃' },
  { id:9, title:'Library Inauguration',  category:'Infrastructure', gradient:'from-cyan-400 to-sky-500',     icon:'📚' },
  { id:10,title:'Class 12 Farewell',     category:'Events',         gradient:'from-lime-400 to-green-500',   icon:'🎓' },
  { id:11,title:'Basketball Finals',     category:'Sports',         gradient:'from-red-400 to-orange-500',   icon:'🏀' },
  { id:12,title:'Art Exhibition',        category:'Cultural',       gradient:'from-yellow-400 to-amber-500', icon:'🖼️' },
];

export default function GalleryPage() {
  const [activeTab,  setActiveTab]  = useState('All');
  const [dbImages,   setDbImages]   = useState<any[]>([]);
  const [selected,   setSelected]   = useState<any>(null);

  useEffect(() => {
    api.get('/public/gallery').then(r => setDbImages(r.data.data || [])).catch(() => {});
  }, []);

  const allImages = dbImages.length > 0
    ? dbImages.map(d => ({ ...d, gradient: 'from-primary-400 to-accent-500', icon: '🖼️' }))
    : placeholderGallery;

  const filtered = activeTab === 'All' ? allImages : allImages.filter(i => i.category === activeTab);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">Gallery</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">
            Glimpses of life at International High School — events, achievements, and memories.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-10 bg-white dark:bg-slate-950 sticky top-16 z-30 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <PhotoIcon className="w-5 h-5 text-gray-400 shrink-0 mr-1" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-400 dark:text-gray-500 shrink-0">
              {filtered.length} photos
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(img => (
              <div
                key={img.id}
                onClick={() => setSelected(img)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {img.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${img.gradient} flex flex-col items-center justify-center`}>
                    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">{img.icon}</span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm leading-tight">{img.title}</p>
                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white/90 text-xs rounded-full mt-1">
                      {img.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-500 dark:text-gray-400">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className={`aspect-square rounded-3xl overflow-hidden bg-gradient-to-br ${selected.gradient} flex items-center justify-center`}>
              {selected.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl">{selected.icon}</span>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white font-display font-bold text-xl">{selected.title}</h3>
              <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full mt-2">{selected.category}</span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
