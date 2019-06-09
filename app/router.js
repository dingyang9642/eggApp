'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    router.get('/news', controller.news.list);
    router.get('/qingsong', controller.qingsong.detail);
    router.get('/lottery/forecast', controller.lottery.forecast);
    router.get('/gdbox', controller.gdbox.doc);
    router.get('/gdbox/demo/drawPolygon', controller.gdbox.drawPolygon);
    router.get('/gdbox/demo/drawRect', controller.gdbox.drawRect);
    router.get('/gdbox/demo/editRect', controller.gdbox.editRect);
    router.get('/gdbox/demo/feature', controller.gdbox.feature);
    router.get('/gdbox/demo/hover', controller.gdbox.hover);
    router.get('/gdbox/demo/img', controller.gdbox.img);
    router.get('/gdbox/demo/marker', controller.gdbox.marker);
    router.get('/gdbox/demo/text', controller.gdbox.text);
};
