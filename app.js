const Hapi = require('hapi');
require('env2')('./.env');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const config = require('./config');
const routesHelloHapi = require('./routes/hello-hapi');
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const routesUsers = require('./routes/users');
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger');
const pluginHapiPagination = require('./plugins/hapi-pagination');
const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');

const server = new Hapi.Server();
// 配置服务器启动 host 与端口
server.connection({
  port: config.port,
  host: config.host,
});

const init = async () => {
  // 注册插件
  await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger,
    pluginHapiPagination,
    hapiAuthJWT2,
  ])
  pluginHapiAuthJWT2(server);
  // 注册路由
  server.route([
    // 创建一个简单的 hello hapi 接口
    ...routesHelloHapi,
    ...routesShops,
    ...routesOrders,
    ...routesUsers,
  ]);

  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();