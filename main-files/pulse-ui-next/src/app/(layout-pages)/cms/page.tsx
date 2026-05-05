"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Image as ImageIcon,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface Content {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function CMSPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'blog',
    image_url: ''
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/content');
      setContents(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (content: Content | null = null) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        title: content.title,
        description: content.description,
        category: content.category,
        image_url: content.image_url
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: '',
        description: '',
        category: 'blog',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingContent) {
        await api.put(`/content/${editingContent.id}`, formData);
        toast.success('Content updated successfully');
      } else {
        await api.post('/content', formData);
        toast.success('Content created successfully');
      }
      setIsModalOpen(false);
      fetchContents();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await api.delete(`/content/${id}`);
      toast.success('Content deleted');
      fetchContents();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.put(`/content/${id}/publish`, {});
      toast.success('Content published!');
      fetchContents();
    } catch (error) {
      toast.error('Publishing failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      // Note: This requires authentication token in localStorage
      const result = await api.upload(file);
      const fullUrl = `http://localhost:5000${result.url}`;
      setFormData({ ...formData, image_url: fullUrl });
      toast.success('Image uploaded', { id: 'upload' });
    } catch (error) {
      toast.error('Upload failed. Using fallback URL.', { id: 'upload' });
      // Fallback to a placeholder if backend upload fails (e.g. no auth)
      setFormData({ ...formData, image_url: `https://picsum.photos/seed/${Date.now()}/800/600` });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage your website content</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          <Plus size={20} />
          <span>Add New Content</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-slate-100 dark:bg-slate-900">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    item.status === 'published' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-slate-900/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {item.status === 'draft' && (
                    <button 
                      onClick={() => handlePublish(item.id)}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      <Send size={14} />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingContent ? 'Edit Content' : 'New Content'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter content title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="blog">Blog/News</option>
                  <option value="service">Service</option>
                  <option value="page">Page Section</option>
                  <option value="hero">Hero Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  placeholder="Enter content description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-2"
                      placeholder="Image URL or upload"
                    />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  {formData.image_url && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={formData.image_url} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingContent ? 'Update' : 'Create'} Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
