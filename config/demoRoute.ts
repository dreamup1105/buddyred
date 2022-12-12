export default [
  {
    path: '/demo',
    name: 'demo',
    routes: [
      {
        path: '/demo/assets',
        name: 'demo-assets',
        routes: [
          {
            name: 'demo-assets-type',
            path: '/demo/assets/chart/type',
            component: './Assets/Chart/Type/demo',
          }
        ]
      },
    ]
  }
];