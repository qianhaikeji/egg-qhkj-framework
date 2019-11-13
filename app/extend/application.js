'use strict';
const IMC = Symbol('Application#imc')
const IMCClass= require('../../lib/base/imc')

module.exports = {
  get imc () {
    if (!this[IMC]) {
      const {apiList = [], hookList = []} = this.config.imc
      this[IMC] = new IMCClass(apiList, hookList)
      // this[IMC].registerMethod('core', 'a', 'test', 'addUser')
      // console.log('####', this[IMC].getHooks())
    }
    return this[IMC]
  },
};
