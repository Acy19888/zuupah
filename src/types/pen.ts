/**
 * Pen (Device) Related Type Definitions
 */

export interface Pen {
  id: string;
  name: string;
  serialNumber: string;
  firmwareVersion: string;
  batteryLevel: number;
  color: string;
  isConnected: boolean;
  lastConnectedAt?: string;
  storageUsed: number;
  storageTotal: number;
  rssi?: number; // Signal strength
}

export interface PenDevice {
  id: string;
  name: string;
  localName?: string;
  isConnectable: boolean;
  rssi: number;
  mtu?: number;
  serviceUUIDs?: string[];
}

export interface BleCharacteristic {
  uuid: string;
  isReadable: boolean;
  isWritableWithoutResponse: boolean;
  isWritable: boolean;
  isNotifiable: boolean;
  isNotifying: boolean;
  isIndicatable: boolean;
  isIndicating: boolean;
  value?: string;
}

export interface BleService {
  uuid: string;
  isPrimary: boolean;
  characteristics?: BleCharacteristic[];
}

export type PenCommand =
  | 'TRANSFER_START'
  | 'TRANSFER_DATA'
  | 'TRANSFER_END'
  | 'GET_STATUS'
  | 'GET_BATTERY'
  | 'GET_VERSION'
  | 'GET_STORAGE'
  | 'DELETE_BOOK'
  | 'RESET';

export interface PenCommandPayload {
  command: PenCommand;
  data?: string | number[] | ArrayBuffer;
  bookId?: string;
  fileSize?: number;
  checksum?: string;
}

export interface PenResponse {
  command: PenCommand;
  status: 'success' | 'error' | 'pending';
  data?: any;
  error?: string;
  timestamp: number;
}

export interface PenStatus {
  serialNumber?: string;
  firmwareVersion?: string;
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  isCharging?: boolean;
  temperature?: number;
  lastUpdated: number;
}

export interface PenTransferProgress {
  bookId: string;
  totalBytes: number;
  transferredBytes: number;
  progress: number; // 0-100
  status: 'pending' | 'transferring' | 'verifying' | 'completed' | 'failed';
  error?: string;
  startTime: number;
  estimatedTimeRemaining?: number;
}

export interface FirmwareVersion {
  id: string;
  version: string;
  releaseNotes: string;
  downloadUrl: string;
  fileSize: number;
  checksum: string;
  releaseDate: string;
  isLatest: boolean;
  isCompatible: boolean;
  minimumPenVersion?: string;
}

export interface FirmwareUpdateProgress {
  progress: number; // 0-100
  status: 'downloading' | 'installing' | 'verifying' | 'completed' | 'failed';
  currentStep?: string;
  error?: string;
  estimatedTimeRemaining?: number;
}

export enum PenConnectionStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}
