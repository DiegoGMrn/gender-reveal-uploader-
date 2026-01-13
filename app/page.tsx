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
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading...');
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
        setUploadProgress('Upload successful! 🎉');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload files
        await loadFiles();
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-blue-400 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            🎀 Gender Reveal Gallery 💙
          </h1>
          <p className="text-center text-lg opacity-90">
            Share your special moments with photos and videos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Upload Your Memory 📸
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-4 border-dashed border-pink-300 rounded-xl p-8 bg-pink-50 hover:bg-pink-100 transition-colors">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-16 h-16 text-pink-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-lg font-semibold text-gray-700">
                    Click to select a file
                  </span>
                  <span className="text-sm text-gray-500 mt-2">
                    Images and videos up to 10MB
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {uploadProgress && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-700">{uploadProgress}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  !selectedFile || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {uploading ? 'Uploading...' : '🎉 Upload File'}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Memory Gallery ({files.length})
          </h2>

          {files.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">
                No memories yet. Upload your first photo or video! 🎈
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-pink-100 hover:border-blue-200 transition-all transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {file.type === 'image' ? (
                      <Image
                        src={`/uploads/${file.name}`}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={`/uploads/${file.name}`}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">Unknown file type</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(file.created).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-400 to-blue-400 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            Made with 💕 for your special Gender Reveal celebration
          </p>
        </div>
      </footer>
    </main>
  );
}
