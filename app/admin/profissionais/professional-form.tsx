'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfessionalForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Falha no upload');
      setPhotoUrl(data.url);
    } catch (e: any) {
      setError(e?.message ?? 'Não foi possível enviar a foto');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch('/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, specialty, bio, photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Falha ao salvar');
      setName('');
      setSpecialty('');
      setBio('');
      setPhotoUrl('');
      setOk(true);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prof-name" className="mb-1 block text-sm text-fg">Nome</label>
        <Input id="prof-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="prof-specialty" className="mb-1 block text-sm text-fg">Especialidade</label>
        <Input
          id="prof-specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Pilates clínico, Yoga restaurativo..."
          required
        />
      </div>
      <div>
        <label htmlFor="prof-bio" className="mb-1 block text-sm text-fg">Bio</label>
        <textarea
          id="prof-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-brand"
          placeholder="Formação, tempo de casa, estilo de aula."
        />
      </div>
      <div>
        <label htmlFor="prof-photo" className="mb-1 block text-sm text-fg">Foto</label>
        <input
          id="prof-photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
          className="block w-full text-sm text-fg-muted file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-brand-fg"
        />
        {uploading && <p className="mt-1 text-xs text-fg-muted">Enviando foto...</p>}
        {photoUrl && (
          <img src={photoUrl} alt="Prévia da foto" className="mt-3 h-20 w-20 rounded-full object-cover" />
        )}
      </div>

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {ok && (
        <p className="rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
          Profissional cadastrado com sucesso.
        </p>
      )}

      <Button type="submit" disabled={saving || uploading} className="w-full">
        {saving ? 'Salvando...' : 'Cadastrar profissional'}
      </Button>
    </form>
  );
}
