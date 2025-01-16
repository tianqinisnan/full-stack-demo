type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  // 订阅事件
  subscribe(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)?.add(callback);

    // 返回取消订阅的函数
    return () => {
      this.events.get(event)?.delete(callback);
      if (this.events.get(event)?.size === 0) {
        this.events.delete(event);
      }
    };
  }

  // 发布事件
  publish(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;
    this.events.get(event)?.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event ${event} callback:`, error);
      }
    });
  }

  // 清除所有事件监听
  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();

// 定义事件名称常量
export const EVENT_NAMES = {
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read'
} as const; 