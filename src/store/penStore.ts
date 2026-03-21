/**
 * Pen (Bluetooth Device) State Store (Zustand)
 * Manages pen connection, transfers, and firmware updates
 */

import { create } from 'zustand';
import {
  Pen,
  PenDevice,
  PenConnectionStatus,
  PenStatus,
  PenTransferProgress,
  FirmwareVersion,
  FirmwareUpdateProgress,
} from '@types/pen';

interface PenStore {
  // State
  connectedPen: Pen | null;
  availableDevices: PenDevice[];
  connectionStatus: PenConnectionStatus;
  isScanning: boolean;
  penStatus: PenStatus | null;
  transferProgress: Map<string, PenTransferProgress>;
  firmwareUpdateProgress: FirmwareUpdateProgress | null;
  availableFirmware: FirmwareVersion | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  startScan: () => void;
  stopScan: () => void;
  addDevice: (device: PenDevice) => void;
  clearDevices: () => void;
  connectToPen: (deviceId: string, name: string) => Promise<void>;
  disconnectPen: () => Promise<void>;
  setConnectionStatus: (status: PenConnectionStatus) => void;
  setPenStatus: (status: PenStatus) => void;
  updateBatteryLevel: (level: number) => void;
  startTransfer: (bookId: string, fileSize: number) => void;
  updateTransferProgress: (bookId: string, progress: number, transferred: number) => void;
  completeTransfer: (bookId: string) => void;
  failTransfer: (bookId: string, error: string) => void;
  cancelTransfer: (bookId: string) => void;
  setFirmwareUpdateProgress: (progress: FirmwareUpdateProgress) => void;
  completeFirmwareUpdate: () => void;
  setAvailableFirmware: (firmware: FirmwareVersion) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const usePenStore = create<PenStore>((set, get) => ({
  connectedPen: null,
  availableDevices: [],
  connectionStatus: PenConnectionStatus.IDLE,
  isScanning: false,
  penStatus: null,
  transferProgress: new Map(),
  firmwareUpdateProgress: null,
  availableFirmware: null,
  error: null,
  isLoading: false,

  startScan: () => {
    set({
      isScanning: true,
      connectionStatus: PenConnectionStatus.SCANNING,
      error: null,
    });
  },

  stopScan: () => {
    set({
      isScanning: false,
    });
  },

  addDevice: (device: PenDevice) => {
    set(state => {
      const exists = state.availableDevices.some(d => d.id === device.id);
      if (exists) {
        return {
          availableDevices: state.availableDevices.map(d =>
            d.id === device.id ? device : d
          ),
        };
      }
      return {
        availableDevices: [...state.availableDevices, device],
      };
    });
  },

  clearDevices: () => {
    set({
      availableDevices: [],
    });
  },

  connectToPen: async (deviceId: string, name: string) => {
    set({
      isLoading: true,
      connectionStatus: PenConnectionStatus.CONNECTING,
      error: null,
    });

    try {
      const device = get().availableDevices.find(d => d.id === deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const GB = 1024 * 1024 * 1024;
      const mockStorageTotal = 4 * GB;
      const mockStorageUsed  = Math.round(1.24 * GB); // ~1.24 GB used

      const pen: Pen = {
        id: deviceId,
        name,
        serialNumber: `SN-${deviceId.substring(0, 8).toUpperCase()}`,
        firmwareVersion: '2.1.4',
        batteryLevel: 78,
        color: 'blue',
        isConnected: true,
        lastConnectedAt: new Date().toISOString(),
        storageUsed: mockStorageUsed,
        storageTotal: mockStorageTotal,
      };

      const mockStatus = {
        serialNumber: pen.serialNumber,
        firmwareVersion: pen.firmwareVersion,
        batteryLevel: pen.batteryLevel,
        storageUsed: mockStorageUsed,
        storageTotal: mockStorageTotal,
        isCharging: false,
        lastUpdated: Date.now(),
      };

      set({
        connectedPen: pen,
        penStatus: mockStatus,
        connectionStatus: PenConnectionStatus.CONNECTED,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        connectionStatus: PenConnectionStatus.ERROR,
        isLoading: false,
      });
      throw error;
    }
  },

  disconnectPen: async () => {
    set({
      isLoading: true,
      connectionStatus: PenConnectionStatus.DISCONNECTING,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      set({
        connectedPen: null,
        connectionStatus: PenConnectionStatus.DISCONNECTED,
        penStatus: null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        connectionStatus: PenConnectionStatus.ERROR,
        isLoading: false,
      });
      throw error;
    }
  },

  setConnectionStatus: (status: PenConnectionStatus) => {
    set({ connectionStatus: status });
  },

  setPenStatus: (status: PenStatus) => {
    set(state => ({
      penStatus: status,
      connectedPen: state.connectedPen
        ? {
            ...state.connectedPen,
            batteryLevel: status.batteryLevel,
            storageUsed: status.storageUsed,
            storageTotal: status.storageTotal,
          }
        : null,
    }));
  },

  updateBatteryLevel: (level: number) => {
    set(state => ({
      connectedPen: state.connectedPen
        ? {
            ...state.connectedPen,
            batteryLevel: level,
          }
        : null,
      penStatus: state.penStatus
        ? {
            ...state.penStatus,
            batteryLevel: level,
          }
        : null,
    }));
  },

  startTransfer: (bookId: string, fileSize: number) => {
    const progress: PenTransferProgress = {
      bookId,
      totalBytes: fileSize,
      transferredBytes: 0,
      progress: 0,
      status: 'pending',
      startTime: Date.now(),
    };

    set(state => ({
      transferProgress: new Map(state.transferProgress).set(bookId, progress),
    }));
  },

  updateTransferProgress: (bookId: string, progress: number, transferred: number) => {
    set(state => {
      const newProgress = new Map(state.transferProgress);
      const transfer = newProgress.get(bookId);

      if (transfer) {
        const elapsed = Date.now() - transfer.startTime;
        const speed = transferred / (elapsed / 1000); // bytes per second
        const remaining = transfer.totalBytes - transferred;
        const eta = remaining / speed;

        newProgress.set(bookId, {
          ...transfer,
          transferredBytes: transferred,
          progress,
          status: 'transferring',
          estimatedTimeRemaining: eta,
        });
      }

      return { transferProgress: newProgress };
    });
  },

  completeTransfer: (bookId: string) => {
    set(state => {
      const newProgress = new Map(state.transferProgress);
      const transfer = newProgress.get(bookId);

      if (transfer) {
        newProgress.set(bookId, {
          ...transfer,
          status: 'completed',
          progress: 100,
        });
      }

      return { transferProgress: newProgress };
    });
  },

  failTransfer: (bookId: string, error: string) => {
    set(state => {
      const newProgress = new Map(state.transferProgress);
      const transfer = newProgress.get(bookId);

      if (transfer) {
        newProgress.set(bookId, {
          ...transfer,
          status: 'failed',
          error,
        });
      }

      return { transferProgress: newProgress };
    });
  },

  cancelTransfer: (bookId: string) => {
    set(state => {
      const newProgress = new Map(state.transferProgress);
      newProgress.delete(bookId);
      return { transferProgress: newProgress };
    });
  },

  setFirmwareUpdateProgress: (progress: FirmwareUpdateProgress) => {
    set({ firmwareUpdateProgress: progress });
  },

  completeFirmwareUpdate: () => {
    set({
      firmwareUpdateProgress: null,
      availableFirmware: null,
    });
  },

  setAvailableFirmware: (firmware: FirmwareVersion) => {
    set({ availableFirmware: firmware });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      connectedPen: null,
      availableDevices: [],
      connectionStatus: PenConnectionStatus.IDLE,
      isScanning: false,
      penStatus: null,
      transferProgress: new Map(),
      firmwareUpdateProgress: null,
      availableFirmware: null,
      error: null,
      isLoading: false,
    });
  },
}));

export default usePenStore;
