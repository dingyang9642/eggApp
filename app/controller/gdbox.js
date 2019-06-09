// app/controller/gdbox.js
const Controller = require('egg').Controller;

class GdboxController extends Controller {
    async doc() {
        const ctx = this.ctx;
        await ctx.render('gdbox/index.html', {});
    }
    async drawRect() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/drawRect/index.html', {});
    }
    async drawPolygon() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/drawPolygon/index.html', {});
    }
    async editRect() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/editRect/index.html', {});
    }
    async feature() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/feature/index.html', {});
    }
    async hover() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/hover/index.html', {});
    }
    async img() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/img/index.html', {});
    }
    async marker() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/marker/index.html', {});
    }
    async text() {
        const ctx = this.ctx;
        await ctx.render('gdbox/demo/text/index.html', {});
    }
}
module.exports = GdboxController;
