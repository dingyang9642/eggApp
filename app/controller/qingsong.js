// app/controller/qingsong.js
const Controller = require('egg').Controller;

class QingsongController extends Controller {
    async detail() {
        const ctx = this.ctx;
        await ctx.render('qingsong/qingsong.htm', {});
    }
}
module.exports = QingsongController;
