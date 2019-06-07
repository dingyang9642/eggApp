'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    router.get('/news', controller.news.list);
    router.get('/qingsong', controller.qingsong.detail);
    router.get('/gdbox', controller.gdbox.detail);
    router.get('/lottery/forecast', controller.lottery.forecast);
};
