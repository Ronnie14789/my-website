import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  size: number;
}

interface UseFileUploadOptions {
  endpoint: 'project-image' | 'blog-image' | 'avatar';
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = ({ endpoint, onSuccess, onError }: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        onError?.('Only JPEG, PNG, and WebP images are allowed');
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        onError?.('File size must be less than 5MB');
        return null;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append('image', file);

        const { data } = await api.post(`/upload/${endpoint}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(pct);
            }
          },
        });

        onSuccess?.(data.data);
        return data.data as UploadResult;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Upload failed';
        onError?.(message);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [endpoint, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setPreview(null);
    setProgress(0);
    setUploading(false);
  }, []);

  return { upload, uploading, progress, preview, reset };
};
