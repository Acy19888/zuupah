/**
 * Zuupah Pen Communication Protocol
 * Handles all command and data exchange with the pen device
 */

import { CONFIG } from '@constants/config';
import { PenCommand, PenCommandPayload, PenResponse, PenStatus } from '@types/pen';
import BleManager from './BleManager';

export class PenProtocol {
  private deviceId: string | null = null;
  private commandTimeout = CONFIG.BLE_COMMAND_TIMEOUT;
  private pendingResponse: Map<string, any> = new Map();

  /**
   * Initialize protocol with device
   */
  async initialize(deviceId: string): Promise<void> {
    this.deviceId = deviceId;

    // Subscribe to notifications
    await BleManager.subscribeToCharacteristic(
      deviceId,
      CONFIG.BLE_SERVICE_UUID,
      CONFIG.BLE_NOTIFY_CHARACTERISTIC,
      (value: string) => this.handleResponse(value)
    );
  }

  /**
   * Send command to pen
   */
  async sendCommand(payload: PenCommandPayload): Promise<PenResponse> {
    if (!this.deviceId) {
      throw new Error('Device not initialized');
    }

    try {
      // Encode command
      const encoded = this.encodeCommand(payload);

      // Send via BLE write
      await BleManager.writeCharacteristic(
        this.deviceId,
        CONFIG.BLE_SERVICE_UUID,
        CONFIG.BLE_WRITE_CHARACTERISTIC,
        encoded
      );

      // Wait for response with timeout
      const response = await this.waitForResponse(
        payload.command,
        this.commandTimeout
      );

      return response;
    } catch (error) {
      console.error('Error sending command:', error);
      throw new Error(`Failed to send command: ${payload.command}`);
    }
  }

  /**
   * Get pen status
   */
  async getPenStatus(): Promise<PenStatus> {
    const response = await this.sendCommand({
      command: 'GET_STATUS',
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to get status');
    }

    return response.data as PenStatus;
  }

  /**
   * Get battery level
   */
  async getBatteryLevel(): Promise<number> {
    const response = await this.sendCommand({
      command: 'GET_BATTERY',
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to get battery');
    }

    return response.data as number;
  }

  /**
   * Get firmware version
   */
  async getFirmwareVersion(): Promise<string> {
    const response = await this.sendCommand({
      command: 'GET_VERSION',
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to get version');
    }

    return response.data as string;
  }

  /**
   * Get storage information
   */
  async getStorage(): Promise<{ used: number; total: number }> {
    const response = await this.sendCommand({
      command: 'GET_STORAGE',
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to get storage');
    }

    return response.data as { used: number; total: number };
  }

  /**
   * Start book transfer
   */
  async startTransfer(bookId: string, fileSize: number): Promise<void> {
    const response = await this.sendCommand({
      command: 'TRANSFER_START',
      bookId,
      fileSize,
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to start transfer');
    }
  }

  /**
   * Send transfer data chunk
   */
  async sendTransferData(
    bookId: string,
    chunkIndex: number,
    data: number[],
    checksum: string
  ): Promise<void> {
    const response = await this.sendCommand({
      command: 'TRANSFER_DATA',
      bookId,
      data,
      checksum,
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to send transfer data');
    }
  }

  /**
   * End book transfer
   */
  async endTransfer(bookId: string, checksum: string): Promise<void> {
    const response = await this.sendCommand({
      command: 'TRANSFER_END',
      bookId,
      checksum,
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to end transfer');
    }
  }

  /**
   * Delete book from pen
   */
  async deleteBook(bookId: string): Promise<void> {
    const response = await this.sendCommand({
      command: 'DELETE_BOOK',
      bookId,
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to delete book');
    }
  }

  /**
   * Reset pen to factory settings
   */
  async resetPen(): Promise<void> {
    const response = await this.sendCommand({
      command: 'RESET',
    });

    if (response.status === 'error') {
      throw new Error(response.error || 'Failed to reset pen');
    }
  }

  /**
   * Encode command to binary format
   */
  private encodeCommand(payload: PenCommandPayload): string {
    // Create binary format: [command_id][data_length][data]
    const commandMap: Record<PenCommand, number> = {
      TRANSFER_START: 0x01,
      TRANSFER_DATA: 0x02,
      TRANSFER_END: 0x03,
      GET_STATUS: 0x04,
      GET_BATTERY: 0x05,
      GET_VERSION: 0x06,
      GET_STORAGE: 0x07,
      DELETE_BOOK: 0x08,
      RESET: 0x09,
    };

    const commandId = commandMap[payload.command];
    let data = '';

    // Encode payload data based on command
    if (payload.bookId) {
      data += payload.bookId;
    }
    if (payload.fileSize !== undefined) {
      data += payload.fileSize.toString();
    }
    if (payload.checksum) {
      data += payload.checksum;
    }
    if (Array.isArray(payload.data)) {
      data += Buffer.from(payload.data).toString('base64');
    }

    // Format: command_id:data
    return `${commandId}:${data}`;
  }

  /**
   * Decode response from pen
   */
  private decodeResponse(data: string): PenResponse {
    try {
      // Expected format: command_id:status:data
      const parts = data.split(':');
      const commandId = parseInt(parts[0], 10);
      const status = parts[1] as 'success' | 'error' | 'pending';
      const responseData = parts.slice(2).join(':');

      const commandMap: Record<number, PenCommand> = {
        0x01: 'TRANSFER_START',
        0x02: 'TRANSFER_DATA',
        0x03: 'TRANSFER_END',
        0x04: 'GET_STATUS',
        0x05: 'GET_BATTERY',
        0x06: 'GET_VERSION',
        0x07: 'GET_STORAGE',
        0x08: 'DELETE_BOOK',
        0x09: 'RESET',
      };

      return {
        command: commandMap[commandId] || 'GET_STATUS',
        status,
        data: responseData,
        error: status === 'error' ? responseData : undefined,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error decoding response:', error);
      return {
        command: 'GET_STATUS',
        status: 'error',
        error: 'Failed to decode response',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Handle incoming response from device
   */
  private handleResponse(value: string): void {
    const response = this.decodeResponse(value);

    // Resolve pending response promise
    const pendingKey = response.command;
    if (this.pendingResponse.has(pendingKey)) {
      const resolve = this.pendingResponse.get(pendingKey);
      this.pendingResponse.delete(pendingKey);
      resolve(response);
    }
  }

  /**
   * Wait for response from device
   */
  private async waitForResponse(
    command: PenCommand,
    timeout: number
  ): Promise<PenResponse> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingResponse.delete(command);
        reject(new Error(`Command timeout: ${command}`));
      }, timeout);

      this.pendingResponse.set(command, (response: PenResponse) => {
        clearTimeout(timeoutId);
        resolve(response);
      });
    });
  }
}

export default new PenProtocol();
