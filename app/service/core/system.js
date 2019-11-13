const BaseService = require('../../../lib/base/service')

class SystemService extends BaseService {
  constructor(ctx) {
    super(ctx, 'core')
  }

  async getVersion () {
    return this.config.pkg.version
  }

  async addSetting (setting) {
    return await this.models.Setting.create(setting)
  }

  async getSettingList () {
    return await this.models.Setting.findAll()
  }

  async getSettingByKey (key) {
    return await this.models.Setting.findByKey(key)
  }
  
  async updateSettingById (id, data) {
    let transaction = this.t
    let exist = await this.models.Setting.findById(id, {transaction})
    if (!exist) {
      this.throwException(400, `设置项 id=${id} 不存在，不可更新。`)
    }
    exist.v = data
    await exist.save({transaction})
  }
}

module.exports = SystemService