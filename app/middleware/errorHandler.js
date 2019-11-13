'use strict'

module.exports = (option, app) => {
  return async function (ctx, next) {
    let status = null
    let errorMsg = null
    let errorCode = null
    
    try {
      await next()
      status = ctx.status
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this)
      
      status = err.status || 500
      errorMsg = err.originalError ? err.originalError.message : err.original ? err.original.message : err.message
      errorCode = err.code

      // 规整“egg-validate”插件的校验异常
      if (status === 422) {
        errorMsg = err
      }
    }
    
    // 额外处理
    switch (status) {
      case 404:
      errorMsg = 'Not Found'
      break
      case 500:
      if (app.config.env === 'prod')
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      errorMsg = 'Internal Server Error'
      break
    }
    
    ctx.status = status
    if (errorMsg) {
      ctx.body = {
        error: errorMsg,
        errorCode: errorCode
      }
    }
  }
}