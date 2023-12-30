import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('~/pages/index.vue'),
      children: [
        {
          path: 'network',
          component: () => import('~/pages/network/index.vue'),
          children: [
            {
              path: ':requestId',
              component: () => import('~/pages/network/[requestId].vue'),
            },
          ],
        },
        {
          path: 'tabs',
          component: () => import('~/pages/tabs.vue'),
        },
      ],
    },
  ],
});
