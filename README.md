
```js
├── LICENSE
├── README.md
├── app.js
├── config                                           # 项目配置目录
│   ├── config.js                                    # 数据库连接的配置
│   └── index.js                           
├── migrations                                       # 数据迁移的目录
│   ├── 20181215141244-create-shops-table.js
│   ├── 20181215141300-create-goods-table.js
│   └── 20181215141340-add-columns-to-shops-table.js
├── models                                           # 数据库 model 
│   ├── goods.js                                     # 商品表
│   ├── index.js                                     # model 入口与连接
│   └── shps.js                                      # 店铺表
├── package-lock.json
├── package.json                                     # 安装的插件
├── plugins                                          # 引入的插件
│   └── hapi-swagger.js                              # swagger文档Restulapi
├── routes
│   ├── hello-hapi.js
│   ├── orders.js                                    # 订单接口
│   └── shops.js                                     # 商品接口
├── seeders                                          # 数据填充的目录
│   └── 20181215141355-init-shops.js
└── utils

7 directories, 18 files
```