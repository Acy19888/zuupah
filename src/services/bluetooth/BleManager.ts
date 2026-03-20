/**
 * Bluetooth Low Energy Manager
 * Handles BLE device scanning, connection, and communication
 */

import { BleManager as RNBleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { CONFIG } from '@constants/config';
import { PenDevice, BleService, BleCharacteristic, PenConnectionStatus } from '@types/pen';

export class BleManager {
  private manager: RNBleManager;
  private scanSubscription: any = null;
  private connectionSubscription: any = null;
  private connectedDeviceId: string | null = null;

  constructor() {
    this.manager = new RNBleManager();
  }

  /**
   * Request necessary Bluetooth permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          CONFIG.ANDROID_PERMISSIONS as any[]
        );

        return Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
      }
    }

    // iOS permissions are handled via Info.plist
    return true;
  }

  /**
   * Start scanning for BLE devices
   * @param onDeviceFound - Callback when device is found
   * @returns Promise that resolves when scan completes
   */
  async startScanning(
    onDeviceFound: (device: PenDevice) => void
  ): Promise<void> {
    try {
      // Stop any existing scan
      if (this.scanSubscription) {
        this.scanSubscription.remove();
      }

      await this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          return;
        }

        if (device && device.name?.includes('Zuupah')) {
          const penDevice: PenDevice = {
            id: device.id,
            name: device.name || 'Unknown',
            localName: device.localName,
            isConnectable: device.isConnectable ?? true,
            rssi: device.rssi ?? 0,
            mtu: device.mtu,
            serviceUUIDs: device.serviceUUIDs,
          };

          onDeviceFound(penDevice);
        }
      });

      // Auto-stop scan after duration
      setTimeout(() => {
        this.stopScanning();
      }, CONFIG.BLE_SCAN_DURATION);
    } catch (error) {
      console.error('Error starting scan:', error);
      throw new Error('Failed to start Bluetooth scan');
    }
  }

  /**
   * Stop scanning for BLE devices
   */
  async stopScanning(): Promise<void> {
    try {
      await this.manager.stopDeviceScan();
      if (this.scanSubscription) {
        this.scanSubscription.remove();
        this.scanSubscription = null;
      }
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  }

  /**
   * Connect to a BLE device
   * @param deviceId - Device ID
   * @returns Connected device reference
   */
  async connectToDevice(deviceId: string): Promise<any> {
    try {
      const device = await this.manager.connectToDevice(deviceId, {
        autoConnect: true,
      });

      this.connectedDeviceId = deviceId;

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();

      return device;
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw new Error('Failed to connect to device');
    }
  }

  /**
   * Disconnect from current device
   */
  async disconnectDevice(): Promise<void> {
    try {
      if (this.connectedDeviceId) {
        await this.manager.cancelDeviceConnection(this.connectedDeviceId);
        this.connectedDeviceId = null;
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  /**
   * Check if device is connected
   * @param deviceId - Device ID
   */
  async isConnected(deviceId: string): Promise<boolean> {
    try {
      const device = await this.manager.connectedDevices([]);
      return device.some(d => d.id === deviceId);
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  /**
   * Get connected device
   * @param deviceId - Device ID
   */
  async getConnectedDevice(deviceId: string): Promise<any> {
    try {
      const device = await this.manager.connectedDevices([]);
      return device.find(d => d.id === deviceId);
    } catch (error) {
      console.error('Error getting connected device:', error);
      return null;
    }
  }

  /**
   * Read from characteristic
   */
  async readCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<string | null> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      const characteristic = await device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID
      );

      return characteristic.value;
    } catch (error) {
      console.error('Error reading characteristic:', error);
      throw new Error('Failed to read characteristic');
    }
  }

  /**
   * Write to characteristic
   */
  async writeCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: string
  ): Promise<void> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        data
      );
    } catch (error) {
      console.error('Error writing characteristic:', error);
      throw new Error('Failed to write to device');
    }
  }

  /**
   * Subscribe to characteristic notifications
   */
  async subscribeToCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    onValueUpdate: (value: string) => void
  ): Promise<() => void> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      const subscription = device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            onValueUpdate(characteristic.value);
          }
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    } catch (error) {
      console.error('Error subscribing to characteristic:', error);
      throw new Error('Failed to subscribe to device');
    }
  }

  /**
   * Get RSSI (signal strength)
   */
  async getRSSI(deviceId: string): Promise<number> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      const rssi = await device.readRSSI();
      return rssi;
    } catch (error) {
      console.error('Error reading RSSI:', error);
      return 0;
    }
  }

  /**
   * Get MTU (Maximum Transmission Unit)
   */
  async getMTU(deviceId: string): Promise<number> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      const mtu = await device.getMTU();
      return mtu;
    } catch (error) {
      console.error('Error reading MTU:', error);
      return 20; // Default MTU
    }
  }

  /**
   * Discover services and characteristics
   */
  async discoverServices(deviceId: string): Promise<BleService[]> {
    try {
      const device = await this.getConnectedDevice(deviceId);
      if (!device) {
        throw new Error('Device not connected');
      }

      const services = await device.discoverAllServicesAndCharacteristics();
      return [];
    } catch (error) {
      console.error('Error discovering services:', error);
      throw new Error('Failed to discover services');
    }
  }

  /**
   * Cleanup and destroy manager
   */
  async destroy(): Promise<void> {
    try {
      await this.stopScanning();
      await this.disconnectDevice();
      this.manager.destroy();
    } catch (error) {
      console.error('Error destroying BLE manager:', error);
    }
  }
}

export default new BleManager();
