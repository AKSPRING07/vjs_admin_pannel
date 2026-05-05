"use client";

import React, { useState, useEffect } from 'react';
import FadeIn from "@/components/ui/FadeIn";
import { Loader2, Calendar, Tag, ChevronRight } from "lucide-react";

interface Content {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DynamicCMS() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedContent = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/content?status=published');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.data || await response.json();
      setContents(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to the backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedContent();
    // Auto-refresh every 5 seconds as requested
    const interval = setInterval(fetchPublishedContent, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && contents.length === 0) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <section id="cms-content" className="py-24 bg-slate-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Latest from VJS CMS
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Real-time updates from our administration panel. Everything you see here is managed dynamically.
            </p>
          </FadeIn>
        </div>

        {error && (
          <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg mb-8">
            {error} - Make sure the backend is running on port 5000
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.length > 0 ? (
            contents.map((item) => (
              <FadeIn key={item.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/800x600?text=VJS+Content'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        {item.category}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                      Read More <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 text-lg">No published content available yet.</p>
              <p className="text-slate-400 text-sm mt-2">Publish some content from the admin panel to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
