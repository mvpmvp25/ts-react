export default {
  name: 'react-admin-hooks',
  version: '1.0.0',
  hostUrl: location.origin, // http://localhost:8063
  indexPath: '/general/welcome',
  // nothingPath: "/error/nothing", // 访问拒绝提示页面
  routeExclude: ['/order/list'], // 忽略的路由(不需要生成路由的路径)
  routeTimeout: 10000, // 页面加载超时时间 10 seconds
  leftMenuList: [
    // 左侧主菜单
    {
      navKey: 'general',
      navName: 'textxxx',
      icon: 'notification',
      menu: [{ key: 'welcome', name: 'text111' }]
    },
    {
      navKey: 'user',
      navName: 'textyyy',
      icon: 'notification',
      menu: [{ key: 'list', name: 'text222' }]
    }
  ],
  zone: {
    local: {
      serverUrl: 'https://www.fastmock.site/mock/560cc860d5341f83ccec8daabb60cfcc/frontend/'
    },
    dev: {
      serverUrl: ''
    },
    stg: {
      serverUrl: ''
    },
    uat: {
      serverUrl: ''
    },
    prod: {
      serverUrl: ''
    }
  }
};
