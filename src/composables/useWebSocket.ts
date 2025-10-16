import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAuthStore } from 'src/stores/auth';
import type { PermissionPushDto } from 'src/types/auth';

/**
 * WebSocket 连接状态
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * WebSocket 客户端管理
 * 用于连接后端 Socket.IO 服务器，接收权限推送
 */
class WebSocketClient {
  private socket: Socket | null = null;
  private connectionState = ref<ConnectionState>(ConnectionState.DISCONNECTED);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelays = [1000, 2000, 5000, 10000, 30000];
  private permissionUpdateCallbacks: Array<(data: PermissionPushDto) => void> = [];

  /**
   * 获取 WebSocket 服务器 URL
   */
  private getSocketUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    // 移除末尾的斜杠
    return baseUrl.replace(/\/$/, '');
  }

  /**
   * 建立 WebSocket 连接
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('[WebSocket] 已经连接，无需重复连接');
      return;
    }

    const authStore = useAuthStore();
    if (!authStore.isAuthenticated || !authStore.accessToken) {
      console.warn('[WebSocket] 用户未登录，无法建立连接');
      return;
    }

    this.connectionState.value = ConnectionState.CONNECTING;
    console.log('[WebSocket] 正在连接...');

    // 创建 Socket.IO 客户端
    this.socket = io(this.getSocketUrl(), {
      auth: {
        token: authStore.accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 10000,
    });

    // 注册事件监听器
    this.registerEventListeners();
  }

  /**
   * 注册所有事件监听器
   */
  private registerEventListeners(): void {
    if (!this.socket) return;

    // 连接成功
    this.socket.on('connected', (data) => {
      this.connectionState.value = ConnectionState.CONNECTED;
      this.reconnectAttempts = 0;
      console.log('[WebSocket] 连接成功', data);
    });

    // 连接错误
    this.socket.on('connect_error', (error) => {
      this.connectionState.value = ConnectionState.ERROR;
      console.error('[WebSocket] 连接错误', error.message);
    });

    // 断开连接
    this.socket.on('disconnect', (reason) => {
      this.connectionState.value = ConnectionState.DISCONNECTED;
      console.log('[WebSocket] 断开连接', reason);
    });

    // 重连尝试
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      this.connectionState.value = ConnectionState.RECONNECTING;
      this.reconnectAttempts = attemptNumber;
      console.log(`[WebSocket] 重连尝试 ${attemptNumber}/${this.maxReconnectAttempts}`);
    });

    // 重连成功
    this.socket.on('reconnect', (attemptNumber) => {
      this.connectionState.value = ConnectionState.CONNECTED;
      this.reconnectAttempts = 0;
      console.log(`[WebSocket] 重连成功，尝试次数: ${attemptNumber}`);
    });

    // 重连失败
    this.socket.on('reconnect_failed', () => {
      this.connectionState.value = ConnectionState.ERROR;
      console.error('[WebSocket] 重连失败，已达到最大重试次数');
    });

    // 服务器错误
    this.socket.on('error', (error) => {
      console.error('[WebSocket] 服务器错误', error);
    });

    // 权限更新事件
    this.socket.on('permission:updated', (data: PermissionPushDto) => {
      console.log('[WebSocket] 收到权限更新', data);
      this.handlePermissionUpdate(data);
    });
  }

  /**
   * 处理权限更新
   */
  private handlePermissionUpdate(data: PermissionPushDto): void {
    // 验证数据格式
    if (!data || !Array.isArray(data.permissions) || !Array.isArray(data.buttonPermissions)) {
      console.error('[WebSocket] 权限数据格式无效', data);
      return;
    }

    // 调用所有注册的回调函数
    this.permissionUpdateCallbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('[WebSocket] 权限更新回调执行失败', error);
      }
    });
  }

  /**
   * 注册权限更新回调
   */
  onPermissionUpdated(callback: (data: PermissionPushDto) => void): void {
    this.permissionUpdateCallbacks.push(callback);
  }

  /**
   * 移除权限更新回调
   */
  offPermissionUpdated(callback: (data: PermissionPushDto) => void): void {
    const index = this.permissionUpdateCallbacks.indexOf(callback);
    if (index > -1) {
      this.permissionUpdateCallbacks.splice(index, 1);
    }
  }

  /**
   * 断开 WebSocket 连接
   */
  disconnect(): void {
    if (this.socket) {
      console.log('[WebSocket] 正在断开连接...');
      this.socket.disconnect();
      this.socket = null;
      this.connectionState.value = ConnectionState.DISCONNECTED;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * 获取连接状态
   */
  getConnectionState() {
    return computed(() => this.connectionState.value);
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.connectionState.value === ConnectionState.CONNECTED;
  }
}

// 创建单例实例
const webSocketClient = new WebSocketClient();

/**
 * WebSocket Composable
 * 用于在 Vue 组件中管理 WebSocket 连接
 */
export function useWebSocket() {
  return {
    connect: () => webSocketClient.connect(),
    disconnect: () => webSocketClient.disconnect(),
    onPermissionUpdated: (callback: (data: PermissionPushDto) => void) =>
      webSocketClient.onPermissionUpdated(callback),
    offPermissionUpdated: (callback: (data: PermissionPushDto) => void) =>
      webSocketClient.offPermissionUpdated(callback),
    connectionState: webSocketClient.getConnectionState(),
    isConnected: () => webSocketClient.isConnected(),
  };
}
