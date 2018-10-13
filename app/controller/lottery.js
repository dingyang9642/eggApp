// app/controller/lottery.js
const Controller = require('egg').Controller;

class LotteryController extends Controller {
    async forecast() {
        const ctx = this.ctx;
        const forecastResult = await ctx.service.lottery.forecast();
        this.ctx.body = forecastResult;
    }
}
module.exports = LotteryController;
