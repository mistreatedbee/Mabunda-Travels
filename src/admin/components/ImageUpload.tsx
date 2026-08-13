import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ImageRef } from '../../lib/types';
import { useAuth } from '../AuthContext';
import { useToast } from './Toast';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 6000; // px, guards against decompression-bomb style images

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image dimensions.'));
    };
    img.src = url;
  });
}

/**
 * Multi-image uploader backed by the public "media" Supabase Storage bucket.
 * Validates type/size/dimensions client-side before upload; bucket-level
 * policies (RLS + allowed_mime_types + file_size_limit) enforce it again
 * server-side.
 */
export default function ImageUpload({
  value,
  onChange,
  folder,
  maxImages = 8,
}: {
  value: ImageRef[];
  onChange: (next: ImageRef[]) => void;
  folder: string;
  maxImages?: number;
}) {
  const { showError } = useToast();
  const { admin } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    if (value.length + files.length > maxImages) {
      showError(`You can upload at most ${maxImages} images here.`);
      return;
    }

    setUploading(true);
    const uploaded: ImageRef[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showError(`"${file.name}" isn't a supported image type (use JPEG, PNG or WebP).`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        showError(`"${file.name}" is larger than 5MB.`);
        continue;
      }

      try {
        const { width, height } = await readImageDimensions(file);
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          showError(`"${file.name}" is too large (max ${MAX_DIMENSION}px per side).`);
          continue;
        }
      } catch {
        showError(`"${file.name}" could not be read as an image.`);
        continue;
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      });

      if (error) {
        showError(`Failed to upload "${file.name}": ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      const alt = file.name.replace(/\.[^.]+$/, '');
      uploaded.push({ url: data.publicUrl, alt });

      // Track every upload centrally in the Media Library — best-effort,
      // never blocks the form's own image list if it fails.
      const { error: mediaError } = await supabase.from('media').insert({
        storage_path: path,
        url: data.publicUrl,
        alt_text: alt,
        file_size: file.size,
        mime_type: file.type,
        folder,
        uploaded_by: admin?.id,
      });
      if (mediaError) {
        console.error('Failed to record media library entry:', mediaError.message);
      }
    }

    if (uploaded.length) onChange([...value, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function updateAlt(index: number, alt: string) {
    onChange(value.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((img, i) => (
          <div key={`${img.url}-${i}`} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={img.url} alt={img.alt} className="w-full h-28 object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            <input
              value={img.alt}
              onChange={(e) => updateAlt(i, e.target.value)}
              placeholder="Alt text"
              aria-label={`Alt text for image ${i + 1}`}
              className="w-full text-xs px-2 py-1.5 bg-white outline-none border-t border-gray-100"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || value.length >= maxImages}
          className="h-28 rounded-xl border-2 border-dashed border-gray-300 hover:border-forest-400 flex flex-col items-center justify-center gap-1.5 text-forest-500 hover:text-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={20} aria-hidden="true" />}
          <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Add image'}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-xs text-forest-500">JPEG, PNG or WebP. Max 5MB each, up to {maxImages} images.</p>
    </div>
  );
}
