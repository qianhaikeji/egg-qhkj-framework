const jwt = require('jsonwebtoken')
const Service = require('egg').Service

class BaseService extends Service {

  constructor(ctx, namespace) {
    if (!namespace) {
      throw new ReferenceError("Please define namespace attr to the Class!");
    }

    super(ctx)
    this.namespace = namespace
  }

  _getJwtInfo () {
    const {ctx} = this

    const token = ctx.header.authorization
    if (!token) {
      this.throwException(401, '未携带有效的 token')
    }

    let jwtInfo = jwt.decode(token.split(' ')[1])
    if (!jwtInfo) {
      this.throwException(401, '未携带有效的 token')
    }
    return jwtInfo.data
  }

  /**
   * 暂时不适用真的jwt鉴权
   */
  get userId () {
    // TODO: deleted
    // if (ctx.app.config.env === 'local') {
      // return 1
      // }
      
      
    // TODO: 拦截点
    // 所有获取当前用户的业务逻辑，都先检查unionId是否存在.
    // 若没有 unionid，认为是无效用户，不能进行任何业务操作，否则会牵扯合并用户的流程。
    // 此处可以直接返回 user，并做成懒加载。因为一个请求中可能多处需要使用。
    
    const jwtInfo = this._getJwtInfo()
    if (jwtInfo.type === 'user') {
      return jwtInfo.userId
    }
  }

  get adminId () {
    const jwtInfo = this._getJwtInfo()
    if (jwtInfo.type === 'admin') {
      return jwtInfo.adminId
    }
  }

  get services () {
    return this.ctx.service[this.namespace]
  }

  get t () {
    return this.ctx.transaction
  }

  get models () {
    // return this.ctx.model[this.namespace] || this.ctx.model
    return this.ctx.model
  }

  get enums () {
    return this.ctx.helper.enums
  }

  get logger () {
    return this.ctx.logger
  }

  get knex () {
    return this.app.knex
  }

  get Sequelize () {
    return this.app.Sequelize
  }

  throwException (httpStatusCode, message) {
    this.ctx.throw(httpStatusCode, message)
  }

  async callApi (method, ...args) {
    return this.ctx.app.imc.executeMethod(this.ctx, method, ...args)
  }

  async processHook (hookName, ...args) {
    return this.ctx.app.imc.processHook(this.ctx, this.namespace, hookName, ...args)
  }

  formatPageParams(params) {
    const {
      page = 1,
      pageSize = 10,
      sort = 'id',
      sortDirection = 'asc',
      fuzzy = '',
      fuzzyProperties = ''
    } = params

    let options = {
      offset: (Number(page) - 1) * Number(pageSize),
      limit: parseInt(pageSize),
      order: [[sort, sortDirection]],
      where: {}
    }
    if (fuzzy && fuzzyProperties) {
      let props = fuzzyProperties.split(',')
      let fuzzyConditions = []
      for (let prop of props) {
        fuzzyConditions.push({ [prop]: {[this.app.Sequelize.Op.like]: `%${params.fuzzy}%`} })
      }
      options.where = {$or: fuzzyConditions}
    }
    return options
  }
}

module.exports = BaseService