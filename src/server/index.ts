import Koa from "koa";
import server from "koa-static";

class Server {
  private koa;

  public constructor(options) {
    this.koa = null;
    this.skeletion = new Skeleton();
  }

  public async addRouters() {
  }

  public async run() {
    this.koa = new Koa();
    this.koa.listen("8989");
  }
}

export default Server;
