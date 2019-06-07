// app/controller/gdbox.js
const Controller = require('egg').Controller;

class GdboxController extends Controller {
    async detail() {
        const ctx = this.ctx;
        await ctx.render('gdbox/index.html', {});
    }
}
module.exports = GdboxController;
