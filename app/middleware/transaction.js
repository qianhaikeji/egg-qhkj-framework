'use strict'

module.exports = (option, app) => {
  return async function (ctx, next) {
    const t = await ctx.model.transaction()
    ctx.transaction = t    
    try {
      await next()
      await t.commit()
    } catch (err) {
      await t.rollback()
      throw err
    }
  }
}