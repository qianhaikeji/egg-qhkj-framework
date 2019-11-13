const _ = require('lodash')

class IMC {
  constructor (apiArray = [], hookArray = []) {
    this.hooks = {}
    this.apiList = {}

    this._initApiList(apiArray)
    this._initHooks(hookArray)
  }

  getApiList () {
    const apiList = this.apiList
    return apiList
  }

  getHooks () {
    const hooks = this.hooks
    return hooks
  }

  /**
   * 注册模块对外提供的api
   */
  _initApiList (apiListJson) {
    for (let module of apiListJson) {
      for (let api of module.api) {
        this.registerMethod(module.moduleName, api.service, api.method, api.name)
      }
    }
  }

    /**
   * 注册模块间的回调通知处理
   */
  _initHooks (callbackListJson) {
    for (let source of callbackListJson) {
      for (let hook of source.hooks) {
        for (let listener of hook.listeners) {
          this.registerHook(source.sourceModule, hook.hookName, listener.module, listener.service, listener.method)
        }
      }
    }
  }

  registerMethod (module, service, method, apiName) {
    this.apiList[apiName] = (ctx, ...args) => {
      return ctx.service[module][service][method](...args)
    }
  }

  executeMethod (ctx, method, ...args) {
    return this.apiList[method](ctx, ...args)
  }

  registerHook (sourceModule, hookName, listenerMoudle, listenerService, listenerMethod) {
    let callback = (ctx, ...args) => {
      return ctx.service[listenerMoudle][listenerService][listenerMethod](...args)
    }

    if (!_.get(this.hooks, `${sourceModule}.${hookName}`)) {
      _.merge(this.hooks, {[sourceModule]: {[hookName]: [callback]}})
    } else {
      this.hooks[sourceModule][hookName].push(callback)
    }
  }

  async processHook (ctx, sourceModule, hookName, ...args) {
    for (let callback of this.hooks[sourceModule][hookName]) {
      await callback(ctx, ...args)
    }
  }
}

module.exports = IMC