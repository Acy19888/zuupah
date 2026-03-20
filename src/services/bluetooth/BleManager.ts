/**
 * BLE Manager — Mock for Expo Go testing
 * Real BLE implementation will be used in production build
 */
import { PenDevice } from '@types/pen';

export class BleManager {
  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async startScanning(onDeviceFound: (device: PenDevice) => void): Promise<void> {
    // Simulate finding a pen after 2 seconds in demo mode
    setTimeout(() => {
      onDeviceFound({
        id: 'mock-pen-001',
        name: 'Zuupah Pen',
        localName: 'Zuupah Pen',
        isConnectable: true,
        rssi: -65,
        mtu: 23,
        serviceUUIDs: [],
      });
    }, 2000);
  }

  async stopScanning(): Promise<void> {}

  async connectToDevice(deviceId: string): Promise<any> {
    await new Promise(r => setTimeout(r, 1000));
    return { id: deviceId };
  }

  async disconnectDevice(): Promise<void> {}

  async isConnected(_deviceId: string): Promise<boolean> {
    return false;
  }

  async readCharacteristic(_deviceId: string, _serviceUUID: string, _charUUID: string): Promise<string | null> {
    return null;
  }

  async writeCharacteristic(_deviceId: string, _serviceUUID: string, _charUUID: string, _data: string): Promise<void> {}

  async subscribeToCharacteristic(_deviceId: string, _serviceUUID: string, _charUUID: string, _onValue: (v: string) => void): Promise<() => void> {
    return () => {};
  }

  async getRSSI(_deviceId: string): Promise<number> { return -65; }
  async getMTU(_deviceId: string): Promise<number> { return 23; }
  async discoverServices(_deviceId: string): Promise<any[]> { return []; }
  async destroy(): Promise<void> {}
}

export default new BleManager();
