/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/v3/': {
      target: 'http://yxkdev.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/v1/': {
      target: 'http://yxkdev.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/ent/': {
      target: 'http://yxkdev.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/ws/': {
      target: 'http://yxkdev.bjyixiu.com/',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/': '' },
    },
    '/msg/': {
      target: 'http://yxkdev.bjyixiu.com/',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/': '' },
    }
  },
  test: {
    '/v3/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/v1/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/ent/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
  },
  pre: {
    '/v3/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/v1/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
    '/ent/': {
      target: 'http://yrttest.bjyixiu.com/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
  },
};
