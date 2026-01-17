"use client";

import { useEffect, useState } from "react";

interface FileData {
  name: string;
  size: number;
  created: string;
  type: "image" | "video" | "unknown";
  hidden?: boolean;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const res = await fetch('/api/manage/status');
      const data = await res.json();
      setAuth(!!data.authenticated);
      if (data.authenticated) await loadFiles();
    } catch (err) {
      console.error(err);
    }
  }

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/manage/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuth(true);
        setPassword('');
        await loadFiles();
      } else {
        const data = await res.json();
        setMessage(data?.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Login failed');
    }
  }

  async function logout() {
    await fetch('/api/manage/logout', { method: 'POST' });
    setAuth(false);
    setFiles([]);
  }

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetch('/api/files?includeHidden=true');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm('¿Eliminar este archivo de forma permanente?')) return;
    try {
      const res = await fetch('/api/manage/file', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setMessage('Eliminado');
        await loadFiles();
      } else {
        const data = await res.json();
        setMessage(data?.error || 'Error al eliminar');
      }
    } catch (err) {
      setMessage('Error al eliminar');
    }
  }

  async function handleHide(filename: string, hide: boolean) {
    try {
      const res = await fetch('/api/manage/hide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, hide }),
      });
      if (res.ok) {
        setMessage(hide ? 'Oculto' : 'Visible');
        await loadFiles();
      } else {
        const data = await res.json();
        setMessage(data?.error || 'Error al actualizar');
      }
    } catch (err) {
      setMessage('Error al actualizar');
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          {auth && (
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 text-sm bg-zinc-100 rounded" onClick={loadFiles}>Recargar</button>
              <button className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded" onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </header>

        {!auth ? (
          <form onSubmit={login} className="bg-zinc-50 p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full p-3 rounded border border-zinc-200 mb-4" />
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-zinc-900 text-white rounded" type="submit">Entrar</button>
              <button type="button" className="px-4 py-2 bg-zinc-100 rounded" onClick={()=>setPassword('')}>Limpiar</button>
            </div>
            {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
          </form>
        ) : (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-zinc-500">{files.length} archivos</p>
            </div>

            <div className="space-y-4">
              {loading && <p>Cargando...</p>}
              {message && <p className="text-sm text-zinc-600">{message}</p>}
              {files.map((f) => (
                <div key={f.name} className={`flex items-center justify-between bg-white border border-zinc-100 rounded p-3 ${f.hidden ? 'opacity-70' : ''}`}>
                  <div>
                    <p className="font-medium truncate max-w-[40ch]">{f.name}</p>
                    <p className="text-xs text-zinc-400">{new Date(f.created).toLocaleString()} · {(f.size/1024/1024).toFixed(2)} MB</p>
                  </div>
                  <div className="flex gap-2">
                    {f.hidden ? (
                      <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-sm" onClick={() => handleHide(f.name, false)}>Mostrar</button>
                    ) : (
                      <button className="px-3 py-1 bg-zinc-100 rounded text-sm" onClick={() => handleHide(f.name, true)}>Ocultar</button>
                    )}
                    <button className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm" onClick={() => handleDelete(f.name)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
