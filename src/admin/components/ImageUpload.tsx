import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ImageRef } from '../../lib/types';
import { useAuth } from '../AuthContext';
import { useToast } from './Toast';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 6000;

type SniffResult =
  | { kind: 'allowed'; mime: string }
  | { kind: 'heic'; mime: string }
  | { kind: 'unknown'; mime: string | null };

function readBe32(buf: Uint8Array, offset: number): number {
  return ((buf[offset] << 24) | (buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3]) >>> 0;
}

function looksLikeNonImage(head: Uint8Array): boolean {
  const start = String.fromCharCode(...head.slice(0, 8)).trimStart();
  return start.startsWith('<') || start.startsWith('{') || start.startsWith('%PDF');
}

async function sniffImageType(file: File): Promise<SniffResult> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (looksLikeNonImage(head)) return { kind: 'unknown', mime: null };

  if (head[0] === 0xff && head[1] === 0xd8) return { kind: 'allowed', mime: 'image/jpeg' };
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) {
    return { kind: 'allowed', mime: 'image/png' };
  }
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 && head[8] === 0x57) {
    return { kind: 'allowed', mime: 'image/webp' };
  }

  const brand = String.fromCharCode(head[4], head[5], head[6], head[7]);
  if (brand === 'ftyp') {
    const subtype = String.fromCharCode(head[8], head[9], head[10], head[11]).toLowerCase();
    if (subtype.includes('heic') || subtype.includes('heif') || subtype.includes('mif1')) {
      return { kind: 'heic', mime: 'image/heic' };
    }
  }

  return { kind: 'unknown', mime: file.type || null };
}

/** Read width/height from file headers when the browser cannot decode the image. */
async function readBinaryDimensions(file: File, mime: string): Promise<{ width: number; height: number } | null> {
  if (mime === 'image/png') {
    const buf = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    if (buf.length < 24) return null;
    const chunk = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
    if (chunk !== 'IHDR') return null;
    const width = readBe32(buf, 16);
    const height = readBe32(buf, 20);
    return width > 0 && height > 0 ? { width, height } : null;
  }

  if (mime === 'image/jpeg') {
    const buf = new Uint8Array(await file.slice(0, Math.min(file.size, 65536)).arrayBuffer());
    if (buf.length < 10 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const height = (buf[i + 5] << 8) | buf[i + 6];
        const width = (buf[i + 7] << 8) | buf[i + 8];
        return width > 0 && height > 0 ? { width, height } : null;
      }
      const len = (buf[i + 2] << 8) | buf[i + 3];
      if (len < 2) return null;
      i += 2 + len;
    }
    return null;
  }

  if (mime === 'image/webp') {
    const buf = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    if (buf.length < 30) return null;
    const tag = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
    if (tag === 'VP8 ' && buf.length >= 30) {
      const width = buf[26] | (buf[27] << 8);
      const height = buf[28] | (buf[29] << 8);
      return width > 0 && height > 0 ? { width, height } : null;
    }
    if (tag === 'VP8L' && buf.length >= 25) {
      const bits = buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return width > 0 && height > 0 ? { width, height } : null;
    }
  }

  return null;
}

async function readWithImageElement(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode-failed'));
    };
    img.src = url;
  });
}

/** Re-encode via canvas — fixes CMYK/progressive JPEGs some browsers reject on <img>. */
async function normaliseToJpeg(file: File): Promise<{ file: File; width: number; height: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { premultiplyAlpha: 'none' });
  } catch {
    bitmap = await createImageBitmap(file);
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no-canvas');
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode-failed'))), 'image/jpeg', 0.92);
    });

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    const normalised = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
    return { file: normalised, width: canvas.width, height: canvas.height };
  } finally {
    bitmap.close();
  }
}

async function prepareUploadFile(file: File): Promise<{ file: File; width: number; height: number; mime: string }> {
  const sniffed = await sniffImageType(file);
  if (sniffed.kind === 'heic') {
    throw new Error(
      'This looks like an iPhone HEIC photo. Open it in Photos or Preview and export as JPEG or PNG, then upload again.'
    );
  }

  const mime =
    sniffed.kind === 'allowed'
      ? sniffed.mime
      : ALLOWED_TYPES.includes(file.type)
        ? file.type
        : null;

  if (!mime) {
    const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    if (looksLikeNonImage(head)) {
      throw new Error(
        'This file looks like a web page or document saved with a .png/.jpg name — not a real photo. Download the image again or take a screenshot and upload that.'
      );
    }
    throw new Error('Use a JPEG, PNG or WebP file — this file type is not supported.');
  }

  try {
    const dims = await readWithImageElement(file);
    return { file, ...dims, mime };
  } catch {
    if (typeof createImageBitmap === 'function') {
      try {
        const normalised = await normaliseToJpeg(file);
        return { ...normalised, mime: 'image/jpeg' };
      } catch {
        // Fall through to binary header read + raw upload.
      }
    }

    const dims = await readBinaryDimensions(file, mime);
    if (dims) {
      return { file, ...dims, mime };
    }

    throw new Error(
      'This file appears damaged or incomplete. Open it in Preview on your Mac — if it opens, use File → Export and save as JPEG, then upload again.'
    );
  }
}

/**
 * Multi-image uploader backed by the public "media" Supabase Storage bucket.
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

    for (const original of Array.from(files)) {
      if (original.size > MAX_SIZE_BYTES) {
        showError(`"${original.name}" is larger than 5MB.`);
        continue;
      }

      let prepared: { file: File; width: number; height: number; mime: string };
      try {
        prepared = await prepareUploadFile(original);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not read this image.';
        showError(`"${original.name}" — ${message}`);
        continue;
      }

      const { file, width, height, mime } = prepared;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        showError(`"${original.name}" is too large (max ${MAX_DIMENSION}px per side).`);
        continue;
      }

      const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: mime,
      });

      if (error) {
        showError(`Failed to upload "${original.name}": ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      const alt = original.name.replace(/\.[^.]+$/, '');
      uploaded.push({ url: data.publicUrl, alt });

      const { error: mediaError } = await supabase.from('media').insert({
        storage_path: path,
        url: data.publicUrl,
        alt_text: alt,
        file_size: file.size,
        mime_type: mime,
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
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-xs text-forest-500">
        JPEG, PNG or WebP. Max 5MB each, up to {maxImages} images. If a photo won&apos;t upload, open it on your computer and save as JPEG.
      </p>
    </div>
  );
}
