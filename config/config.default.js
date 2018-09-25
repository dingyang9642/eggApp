'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1537862940006_2844';

    // 添加 view 配置
    exports.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks'
        }
    };

    // 中间件添加
    exports.middleware = [
        'robot'
    ];
    // robot's configurations
    exports.robot = {
        ua: [
            /aliSpider/i
        ]
    };

    return config;
};
