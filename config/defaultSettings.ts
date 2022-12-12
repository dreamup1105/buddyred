import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
  logo?: string;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/font_2498552_u2nndtfyzh.js',
};

export type { DefaultSettings };

export default proSettings;
