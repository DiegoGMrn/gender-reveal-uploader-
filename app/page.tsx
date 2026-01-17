'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FileData {
  name: string;
  size: number;
  created: string;
  type: 'image' | 'video' | 'unknown';
}

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo primero');
      return;
    }

    setUploading(true);
    setUploadProgress('Subiendo...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadProgress('¡Subida exitosa! 🎉');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload files
        await loadFiles();
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setError(data.error || 'La subida falló');
      }
    } catch (err) {
      setError('La subida falló. Por favor intenta de nuevo.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      {/* Elementos decorativos de fondo sutiles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-light/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-light/30 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <nav className="border-b border-zinc-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Revelación de Sexo
            </h1>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-100 shadow-sm">
            {files.length} Recuerdos
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Upload Section - Left Side on large screens */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-4 block">Nueva Entrada</span>
              <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none">Captura la emoción</h2>
              <p className="text-zinc-500 mb-10 text-lg leading-relaxed font-medium">
                Sube tus momentos favoritos y compártelos con todos.
              </p>
              
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-12 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-500 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_50px_rgba(251,113,133,0.1)]"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                      <svg
                        className="w-8 h-8 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold tracking-tight text-zinc-800">Seleccionar archivo</span>
                    <span className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-wider">Imágenes o Video</span>
                  </label>
                </div>

                {selectedFile && (
                  <div className="bg-gradient-to-r from-pink-50 to-blue-50 border border-white rounded-[1.5rem] p-5 flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95 duration-500">
                    <div className="truncate pr-4">
                      <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">Seleccionado</p>
                      <p className="text-sm font-bold text-zinc-800 truncate">{selectedFile.name}</p>
                    </div>
                    <div className="text-[10px] font-black text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
                    {error}
                  </div>
                )}

                {uploadProgress && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
                    {uploadProgress}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${
                    !selectedFile || uploading
                      ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed shadow-none'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-4 w-4 text-pink-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subiendo
                    </span>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Section - Right Side */}
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-100 pb-8">
              <div>
                <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">Galería</h2>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest italic">Recuerdos compartidos</p>
              </div>
            </div>

            {files.length === 0 ? (
              <div className="bg-white border border-zinc-100 rounded-[3rem] p-24 text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                  <svg className="w-10 h-10 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-zinc-400 font-black tracking-tight text-xl mb-1 relative z-10">
                  Aún no hay fotos
                </p>
                <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest relative z-10">¡Sé el primero!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="group bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden hover:border-zinc-200 transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]"
                  >
                    <div className="relative aspect-[5/4] bg-zinc-50 overflow-hidden">
                      {file.type === 'image' ? (
                        <Image
                          src={`/uploads/${file.name}`}
                          alt={file.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : file.type === 'video' ? (
                        <video
                          src={`/uploads/${file.name}`}
                          controls
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                          <span className="text-zinc-300 font-bold uppercase tracking-widest text-[8px]">Binario</span>
                        </div>
                      )}
                      
                      {/* Subcapa de color sutil en hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-4">
                          <p className="text-xs font-black text-zinc-900 truncate uppercase tracking-[0.2em] mb-2 leading-none">
                            {file.name.split('.').slice(0, -1).join('.')}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">
                            {new Date(file.created).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-[10px] bg-zinc-50 text-zinc-500 px-3 py-1 rounded-full font-black border border-zinc-100 shadow-sm">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-100 mt-40 py-20 bg-zinc-50/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-12 mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-bounce delay-200" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
            Celebrando momentos inolvidables
          </p>
        </div>
      </footer>
    </main>
  );
}
