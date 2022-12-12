import { message, notification } from 'antd';
import Cookies from 'js-cookie';
import { websocketLaunch } from './websocketConfig';
import { audioMap } from '@/components/Audio';

const CMD_TYPE = {
  CMD_HEART_BEAT: 'heart_beat',
};
const defaultOptions = {
  retryLimit: 'infinity',
  retryDelay: 5000,
  heartbeatDelay: 540000, // 9分钟一次心跳
};

const genCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
};

export default class WS {
  WebSocket: WebSocket | null;
  retryTimer: NodeJS.Timeout | null;
  retryLimit: number | string;
  retryDelay: number;
  currentRetryTimes: number;
  heartbeatTimer: NodeJS.Timeout | null;
  heartbeatServerTimer: NodeJS.Timeout | null;
  heartbeatDelay: number;

  constructor(options = defaultOptions) {
    this.WebSocket = null;
    this.retryTimer = null;
    this.retryLimit = options.retryLimit;
    this.retryDelay = options.retryDelay;
    this.currentRetryTimes = 0;
    this.heartbeatTimer = null;
    this.heartbeatServerTimer = null;
    this.heartbeatDelay = options.heartbeatDelay;
  }

  get socket() {
    return this.WebSocket;
  }

  get readyState() {
    return this.WebSocket!.readyState;
  }

  init(url: string, protocol = 'ws') {
    this.clear();
    this.WebSocket = new WebSocket(url, protocol);
  }

  detect() {
    return 'WebSocket' in window;
  }

  onOpen(openHandler: (ev: Event) => any) {
    this.WebSocket!.addEventListener('open', (event) => {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
      }
      this.clearHeartbeat();
      this.heartbeat();
      openHandler(event);
    });
  }

  onMessage(messageHandler: (ev: MessageEvent) => any) {
    this.WebSocket!.addEventListener('message', (event) => {
      this.clearHeartbeat();
      this.heartbeat();
      messageHandler(event);
    });
  }

  onClose(closeHandler: (ev: CloseEvent) => any) {
    this.WebSocket!.addEventListener('close', closeHandler);
  }

  onError(errorHandler: () => any) {
    this.WebSocket!.addEventListener('error', () => {
      errorHandler();
      this.clear();
    });
  }

  retry(retryHandler: () => any) {
    this.retryTimer = setTimeout(() => {
      if (
        this.retryLimit === 'infinity' ||
        this.currentRetryTimes < this.retryLimit
      ) {
        // eslint-disable-next-line no-plusplus
        this.currentRetryTimes++;
        retryHandler();
      } else {
        console.log('已达到最大重连次数');
        this.clear();
      }
    }, this.retryDelay);
  }

  heartbeat() {
    this.heartbeatTimer = setInterval(() => {
      const dataChunk = {
        type: CMD_TYPE.CMD_HEART_BEAT,
        msg: 'ping',
      };
      this.WebSocket!.send(JSON.stringify(dataChunk));
      this.log('ping!');
    }, this.heartbeatDelay);
  }

  clear() {
    clearTimeout(this.retryTimer!);
    this.clearHeartbeat();
    this.WebSocket?.close();
    this.WebSocket = null;
    this.retryTimer = null;
  }

  clearHeartbeat() {
    // clearTimeout(this.heartbeatTimer)
    clearInterval(this.heartbeatTimer!);
    clearTimeout(this.heartbeatServerTimer!);
  }

  log(msg: string) {
    const currentTime = genCurrentTime();
    console.log('当前时间: ', currentTime, msg);
  }
}

/**
 * 开启消息通知的接收任务
 */
export function startMessageTask() {
  const { protocol } = window.location;
  const wsProtocol = protocol.includes('https') ? 'wss' : 'ws';
  const ws = new WS();
  const isSupportWebSocket = ws.detect();

  if (!isSupportWebSocket) {
    message.warning(
      '当前浏览器版本不支持websocket特性，请更换最新版本的chrome浏览器',
    );
    return null;
  }

  const request = () => {
    try {
      const token = Cookies.get('bjyixiu');
      ws.init(
        `${wsProtocol}://${window.location.host}/ws?token=${token}`,
        wsProtocol,
      );

      ws.onOpen(() => {
        console.log('websocket connection successful!');
      });

      ws.onMessage((event: MessageEvent) => {
        if (
          typeof event.data === 'string' &&
          !window.location.hash.includes('/login')
        ) {
          // console.log(event);
          // console.log(event.data);
          // console.log(JSON.parse(event.data));
          const messageData = JSON.parse(event.data);

          // 消息通知语音提示
          audioMap(messageData.extra);

          // 消息通知弹框显示
          // 点击消息通知以后回跳转到对应的列表页面
          notification.open({
            message: messageData.title,
            description: messageData.body,
            // duration: null,
            onClick: () => {
              websocketLaunch(messageData.extra);
            },
          });
        }
      });

      ws.onClose(() => {
        // eslint-disable-next-line no-unneeded-ternary
        const isLogin = false;
        if (isLogin) {
          console.log('websocket disconnect');
          console.log('retry connecting...');
          ws.retry(request);
        } else {
          ws.clear();
        }
      });

      ws.onError(() => {
        console.log('An error occurred in websocket');
      });
    } catch (error) {
      console.log(error);
    }
  };

  request();

  return ws;
}

// 重启消息任务
export function restartMessageTask() {
  if (window.MessageSocketInstance) {
    window.MessageSocketInstance.clear();
  }
  window.MessageSocketInstance = startMessageTask();
}

// 停止消息任务
export function stopMessageTask() {
  if (window.MessageSocketInstance) {
    window.MessageSocketInstance.clear();
  }
  window.MessageSocketInstance = null;
}
