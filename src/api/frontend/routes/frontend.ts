module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/workers',
      handler: 'frontend.getUsers',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/worktime/:id',
      handler: 'frontend.getWorkTime',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/token',
      handler: 'frontend.getToken',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/worker',
      handler: 'frontend.createNewWorker',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      }
    },
    {
      method: 'DELETE',
      path: '/worker/:id',
      handler: 'frontend.deleteWorker',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      }
    },
    {
      method: 'POST',
      path: '/worker/:id',
      handler: 'frontend.updateWorker',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/worktimes',
      handler: 'frontend.getWorkTimes',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/work',
      handler: 'frontend.createWork',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/work/:id',
      handler: 'frontend.deleteWork',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/delete-worktime/:id',
      handler: 'frontend.deleteWorkTime',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/update-work/:id',
      handler: 'frontend.updateWork',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/worktime/:id',
      handler: 'frontend.updateWorkTime',
      config: {
        middlewares: ['api::frontend.token-auth'],
        auth: false,
      },
    },
  ]
}
