const Controller = require('egg').Controller

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.restful = {}
    this.restful.success = function (data) {
      this.ctx.status = 200
      this.ctx.body = data
    }.bind(this)
    this.restful.badRequest = function (data) {
      this.ctx.status = 400
      this.ctx.body = data
    }.bind(this)
    this.restful.created = function (data) {
      this.ctx.status = 201
      this.ctx.body = data
    }.bind(this)
    this.restful.deleted = function (data) {
      this.ctx.status = 204
      this.ctx.body = data
    }.bind(this)
    this.restful.notFound = function () {
      this.ctx.status = 404
    }.bind(this)
    this.restful.unAuth = function () {
      this.ctx.status = 401
    }.bind(this)
  }

  get requestBody () {
    return this.ctx.request.body || {}
  }

  get pathParams () {
    return this.ctx.params
  }

  get queryParams () {
    return this.ctx.query
  }
  
  async withTransaction (opertation) {
    const t = await this.ctx.model.transaction()
    try {
      let res = await opertation(t)
      await t.commit()
      return res
    }
    catch (err) {
      await t.rollback()
      throw err
    }
  }
}

module.exports = BaseController