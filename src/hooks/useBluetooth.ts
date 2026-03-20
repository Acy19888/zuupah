/**
 * useBluetooth Hook
 * Provides Bluetooth pen connection and transfer functionality
 */

import { useCallback, useEffect } from 'react';
import { usePenStore } from '@store/penStore';
import BleManager from '@services/bluetooth/BleManager';
import PenProtocol from '@services/bluetooth/PenProtocol';

export const useBluetooth = () => {
  const {
    connectedPen,
    availableDevices,
    connectionStatus,
    isScanning,
    penStatus,
    transferProgress,
    firmwareUpdateProgress,
    availableFirmware,
    error,
    isLoading,
    startScan,
    stopScan,
    addDevice,
    clearDevices,
    connectToPen,
    disconnectPen,
    setPenStatus,
    startTransfer,
    updateTransferProgress,
    completeTransfer,
    failTransfer,
    cancelTransfer,
    setFirmwareUpdateProgress,
    setAvailableFirmware,
    setError,
    clearError,
  } = usePenStore();

  const handleStartScan = useCallback(async () => {
    try {
      startScan();
      clearDevices();

      const hasPermission = await BleManager.requestPermissions();
      if (!hasPermission) {
        setError('Bluetooth permissions denied');
        return;
      }

      await BleManager.startScanning(device => {
        addDevice({
          id: device.id,
          name: device.name || 'Unknown Device',
          isConnectable: device.isConnectable ?? true,
          rssi: device.rssi,
        });
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, [startScan, clearDevices, addDevice, setError]);

  const handleStopScan = useCallback(async () => {
    try {
      await BleManager.stopScanning();
      stopScan();
    } catch (err: any) {
      setError(err.message);
    }
  }, [stopScan, setError]);

  const handleConnectToPen = useCallback(
    async (deviceId: string, deviceName: string) => {
      try {
        await connectToPen(deviceId, deviceName);
        await PenProtocol.initialize(deviceId);

        // Get initial status
        const status = await PenProtocol.getPenStatus();
        setPenStatus(status);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [connectToPen, setPenStatus, setError]
  );

  const handleDisconnectPen = useCallback(async () => {
    try {
      await disconnectPen();
      await BleManager.disconnectDevice();
    } catch (err: any) {
      setError(err.message);
    }
  }, [disconnectPen, setError]);

  const handleStartTransfer = useCallback(
    async (bookId: string, fileSize: number) => {
      try {
        if (!connectedPen) {
          throw new Error('No pen connected');
        }

        startTransfer(bookId, fileSize);
        await PenProtocol.startTransfer(bookId, fileSize);
      } catch (err: any) {
        failTransfer(bookId, err.message);
        setError(err.message);
      }
    },
    [connectedPen, startTransfer, failTransfer, setError]
  );

  const handleSendTransferData = useCallback(
    async (bookId: string, data: number[], checksum: string, chunkIndex: number) => {
      try {
        if (!connectedPen) {
          throw new Error('No pen connected');
        }

        await PenProtocol.sendTransferData(bookId, chunkIndex, data, checksum);

        const totalChunks = Math.ceil(
          (transferProgress.get(bookId)?.totalBytes || 0) / data.length
        );
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);

        updateTransferProgress(bookId, progress, (chunkIndex + 1) * data.length);
      } catch (err: any) {
        failTransfer(bookId, err.message);
        setError(err.message);
      }
    },
    [connectedPen, transferProgress, updateTransferProgress, failTransfer, setError]
  );

  const handleCompleteTransfer = useCallback(
    async (bookId: string, checksum: string) => {
      try {
        if (!connectedPen) {
          throw new Error('No pen connected');
        }

        await PenProtocol.endTransfer(bookId, checksum);
        completeTransfer(bookId);
      } catch (err: any) {
        failTransfer(bookId, err.message);
        setError(err.message);
      }
    },
    [connectedPen, completeTransfer, failTransfer, setError]
  );

  const handleCancelTransfer = useCallback(
    (bookId: string) => {
      cancelTransfer(bookId);
    },
    [cancelTransfer]
  );

  const handleDeleteBook = useCallback(
    async (bookId: string) => {
      try {
        if (!connectedPen) {
          throw new Error('No pen connected');
        }

        await PenProtocol.deleteBook(bookId);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [connectedPen, setError]
  );

  const handleGetBatteryLevel = useCallback(async () => {
    try {
      if (!connectedPen) {
        throw new Error('No pen connected');
      }

      const batteryLevel = await PenProtocol.getBatteryLevel();
      return batteryLevel;
    } catch (err: any) {
      setError(err.message);
      return 0;
    }
  }, [connectedPen, setError]);

  const handleGetFirmwareVersion = useCallback(async () => {
    try {
      if (!connectedPen) {
        throw new Error('No pen connected');
      }

      const version = await PenProtocol.getFirmwareVersion();
      return version;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [connectedPen, setError]);

  return {
    connectedPen,
    availableDevices,
    connectionStatus,
    isScanning,
    penStatus,
    transferProgress,
    firmwareUpdateProgress,
    availableFirmware,
    error,
    isLoading,
    handleStartScan,
    handleStopScan,
    handleConnectToPen,
    handleDisconnectPen,
    handleStartTransfer,
    handleSendTransferData,
    handleCompleteTransfer,
    handleCancelTransfer,
    handleDeleteBook,
    handleGetBatteryLevel,
    handleGetFirmwareVersion,
    setFirmwareUpdateProgress,
    setAvailableFirmware,
    clearError,
  };
};

export default useBluetooth;
