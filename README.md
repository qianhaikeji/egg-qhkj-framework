Framework功能规划

- 数据库 sequelize, knex
- redis
- 登录鉴权
- 后台管理员
- 前端用户
- 微信相关（鉴权、支付）
- service模块隔离功能
- 文档功能
- system功能



所有使用require('egg')的地方现在全部使用require('qhkj-framework')
在框架中，定制了Egg的Service，使其具备模块间隔离的特性


提供的middleware
errorHandler
transaction