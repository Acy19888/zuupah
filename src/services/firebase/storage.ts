/**
 * Firebase Storage Service — Firebase JS SDK (Expo Go compatible)
 */
import { ref, getDownloadURL, getMetadata, listAll, deleteObject } from 'firebase/storage';
import { firebaseStorage } from './config';

export const getDownloadUrl = async (storagePath: string): Promise<string> => {
  return getDownloadURL(ref(firebaseStorage, storagePath));
};

export const getFileMetadata = async (storagePath: string) => {
  const m = await getMetadata(ref(firebaseStorage, storagePath));
  return { size: m.size, contentType: m.contentType || '', timeCreated: m.timeCreated, updated: m.updated };
};

export const fileExists = async (storagePath: string): Promise<boolean> => {
  try { await getMetadata(ref(firebaseStorage, storagePath)); return true; }
  catch { return false; }
};

export const deleteFile = async (storagePath: string): Promise<void> => {
  await deleteObject(ref(firebaseStorage, storagePath));
};

export const listFiles = async (path: string) => {
  const result = await listAll(ref(firebaseStorage, path));
  return result.items.map(item => ({ name: item.name, path: item.fullPath }));
};

// For Expo Go: just return the download URL (no local file download)
export const downloadFile = async (storagePath: string, _localPath: string, onProgress?: (p: number) => void): Promise<string> => {
  if (onProgress) onProgress(1);
  return getDownloadUrl(storagePath);
};

export const downloadBookAudio = (bookId: string, localPath: string, onProgress?: (p: number) => void) =>
  downloadFile(`books/${bookId}/audio.mp3`, localPath, onProgress);

export const downloadBookCover = (bookId: string, localPath: string) =>
  downloadFile(`books/${bookId}/cover.png`, localPath);

export default { downloadFile, deleteFile, fileExists, getFileMetadata, getDownloadUrl, listFiles, downloadBookAudio, downloadBookCover };
