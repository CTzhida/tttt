module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'sqlite',
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});

// module.exports = {
//   "defaultConnection": "default",
//   "connections": {
//     "default": {
//       "connector": "bookshelf",
//       "settings": {
//         "client": "mysql",
//         "host": "localhost",
//         "port": 3001,
//         "username": "strapi",
//         "password": "root",
//         "database": "strapi"
//       },
//       "options": {}
//     }
//   }
// }
