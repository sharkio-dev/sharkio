import { Request } from "express";

export class PathMetadata {
  private hitCount: number;
  private lastBody: any;
  private lastCall: Date;

  constructor(private readonly method: string, private readonly path: string) {
    this.hitCount = 0;
    this.lastCall = new Date();
  }

  extractMetadata(request: Request) {
    this.incHitCount();
    this.lastBody = request.body;
    this.lastCall = new Date();
  }

  private incHitCount() {
    const [current, next] = [this.hitCount, this.hitCount + 1];
    console.log(
      `increasing path:${this.method} ${this.path} hit count from ${current} to ${next}`
    );
    this.hitCount = next;
  }

  printMetadata() {
    const { method, path, hitCount, lastBody, lastCall } = this;
    console.log(
      JSON.stringify({ method, path, hitCount, lastBody, lastCall }, null, 2)
    );
  }
}
