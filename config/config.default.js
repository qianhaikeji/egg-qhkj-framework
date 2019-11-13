'use strict';

module.exports = appInfo => {
  const config = {};

  /**
   * some description
   * @member Config#test
   * @property {String} key - some description
   */
  config.test = {
    key: appInfo.name + '_123456',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  config.multipart = {
    fileExtensions: [ '.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov' ], // 增加对 .apk 扩展名的支持
  },

  config.bcrypt = {
    saltRounds: 10 // default 10
  }

  config.imc = {
    apiList: [
      {
        "moduleName": "core",
        "api": [
          {"name": "getSettingList", "service": "system", "method": "getSettingList", "doc": "测试"},
        ]
      }
    ],
    hookList: [
      {
        "sourceModule": "core",
        "hooks": [
          {
            "hookName": "onOrderPaySucceeded",
            "doc": "支付成功事件, 参数: {商户内部订单号}",
            "listeners": [
              {"module": "core", "service": "user", "method": "handleOrderPaySucceeded"},
              {"module": "core", "service": "batchExport", "method": "handleBatchOrderPaySucceeded"},
              {"module": "core", "service": "batchExport", "method": "handleMonthlyOrderPaySucceeded"},
              {"module": "core", "service": "order", "method": "handleValueAddedOrderPaySucceeded"}
            ]
          }
        ]
      }
    ]
  }

  return config;
};
