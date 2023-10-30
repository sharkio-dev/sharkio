import { NextFunction, Request, Response } from "express";
import { useLog } from "../../lib/log/index";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { RequestHandler, createProxyMiddleware } from "http-proxy-middleware";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class ProxyMiddleware {
  private proxyMiddleware: RequestHandler;

  constructor(private readonly snifferService: SnifferService) {
    this.proxyMiddleware = createProxyMiddleware({
      router: this.chooseRoute.bind(this),
      secure: false,
      logLevel: "debug",
      autoRewrite: true,
      changeOrigin: true,
      followRedirects: true,
    });
  }

  async chooseRoute(req: Request) {
    const host = req.headers.host;
    const snifferRoutes = await this.snifferService.getAllSniffers();

    const selectedSniffer = snifferRoutes.find(
      (sniffer) => host?.includes(sniffer.subdomain),
    );

    if (selectedSniffer != null) {
      return selectedSniffer.downstreamUrl;
    }

    return "http://" + req.url;
  }

  getMiddleware() {
    return this.proxyMiddleware;
  }
}
