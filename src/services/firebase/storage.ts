/**
 * Firebase Storage Service
 * Handles file uploads and downloads
 */

import { getFirebaseStorage } from './config';
import { CONFIG } from '@constants/config';

const storage = getFirebaseStorage();

/**
 * Download file from Firebase Storage
 * @param storagePath - Path to file in Firebase Storage
 * @param localPath - Local file path to save
 * @param onProgress - Progress callback (0-1)
 * @returns Local file path
 */
export const downloadFile = async (
  storagePath: string,
  localPath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileRef = storage.ref(storagePath);
    const fileSize = (await fileRef.getMetadata()).size;

    if (fileSize > CONFIG.MAX_DOWNLOAD_SIZE) {
      throw new Error('File size exceeds maximum allowed');
    }

    // Download file
    const url = await fileRef.getDownloadURL();

    // For react-native-fs download
    const RNFS = require('react-native-fs');
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
      progress: (res: any) => {
        if (onProgress) {
          onProgress(res.bytesWritten / res.contentLength);
        }
      },
    }).promise;

    if (result.statusCode !== 200) {
      throw new Error('Download failed');
    }

    return localPath;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Upload file to Firebase Storage
 * @param localPath - Local file path
 * @param storagePath - Destination path in Firebase Storage
 * @param onProgress - Progress callback (0-1)
 * @returns Download URL
 */
export const uploadFile = async (
  localPath: string,
  storagePath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileRef = storage.ref(storagePath);

    // Upload file with progress tracking
    await fileRef.putFile(localPath, {
      progress: (snapshot: any) => {
        if (onProgress) {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          onProgress(progress);
        }
      },
    });

    // Get download URL
    const downloadUrl = await fileRef.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from Firebase Storage
 * @param storagePath - Path to file in Firebase Storage
 */
export const deleteFile = async (storagePath: string): Promise<void> => {
  try {
    const fileRef = storage.ref(storagePath);
    await fileRef.delete();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Check if file exists in Firebase Storage
 * @param storagePath - Path to file in Firebase Storage
 * @returns Boolean indicating file existence
 */
export const fileExists = async (storagePath: string): Promise<boolean> => {
  try {
    const fileRef = storage.ref(storagePath);
    await fileRef.getMetadata();
    return true;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      return false;
    }
    throw error;
  }
};

/**
 * Get file metadata
 * @param storagePath - Path to file in Firebase Storage
 * @returns File metadata
 */
export const getFileMetadata = async (
  storagePath: string
): Promise<{
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}> => {
  try {
    const fileRef = storage.ref(storagePath);
    const metadata = await fileRef.getMetadata();

    return {
      size: metadata.size,
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
};

/**
 * Get download URL for a file
 * @param storagePath - Path to file in Firebase Storage
 * @returns Download URL
 */
export const getDownloadUrl = async (storagePath: string): Promise<string> => {
  try {
    const fileRef = storage.ref(storagePath);
    const url = await fileRef.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new Error('Failed to get download URL');
  }
};

/**
 * List files in a Firebase Storage path
 * @param path - Path in Firebase Storage
 * @returns List of file references
 */
export const listFiles = async (
  path: string
): Promise<
  Array<{
    name: string;
    path: string;
  }>
> => {
  try {
    const dirRef = storage.ref(path);
    const result = await dirRef.list();

    return result.items.map(item => ({
      name: item.name,
      path: item.fullPath,
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
};

/**
 * Download book audio file
 * @param bookId - Book ID
 * @param localPath - Local path to save
 * @param onProgress - Progress callback
 * @returns Local file path
 */
export const downloadBookAudio = async (
  bookId: string,
  localPath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storagePath = `books/${bookId}/audio.mp3`;
  return downloadFile(storagePath, localPath, onProgress);
};

/**
 * Download book cover image
 * @param bookId - Book ID
 * @param localPath - Local path to save
 * @returns Local file path
 */
export const downloadBookCover = async (
  bookId: string,
  localPath: string
): Promise<string> => {
  const storagePath = `books/${bookId}/cover.png`;
  return downloadFile(storagePath, localPath);
};

export default {
  downloadFile,
  uploadFile,
  deleteFile,
  fileExists,
  getFileMetadata,
  getDownloadUrl,
  listFiles,
  downloadBookAudio,
  downloadBookCover,
};
