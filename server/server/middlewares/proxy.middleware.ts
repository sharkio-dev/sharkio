import { Request } from "express";
import { useLog } from "../../lib/log/index";
import { SnifferService } from "../../services/sniffer/sniffer.service";
import { RequestHandler, createProxyMiddleware } from "http-proxy-middleware";
import { RequestInterceptor } from "./request-interceptor";
import type * as http from "http";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class ProxyMiddleware {
  private proxyMiddleware: RequestHandler;

  constructor(
    private readonly snifferService: SnifferService,
    private readonly requestInterceptor: RequestInterceptor,
  ) {
    this.proxyMiddleware = createProxyMiddleware({
      router: this.chooseRoute.bind(this),
      secure: false,
      logLevel: "debug",
      autoRewrite: true,
      changeOrigin: true,
      followRedirects: true,
      onProxyRes: async (proxyRes, req, res) => {
        const invocationId = req.headers["x-sharkio-invocation-id"];
        const snifferId = req.headers["x-sharkio-sniffer-id"] as string;
        const userId = req.headers["x-sharkio-user-id"] as string;

        try {
          if (invocationId != null && typeof invocationId === "string") {
            const parsedRes = await this.adaptIncomingResponse(proxyRes);

            await this.requestInterceptor.interceptResponse(
              userId,
              snifferId,
              invocationId,
              parsedRes,
            );
          }
        } catch (e) {
          logger.error(
            "failed to capture response for invocation id" + invocationId,
            e,
          );
        }
      },
    });
  }

  async chooseRoute(req: Request) {
    const host = req.hostname;
    const subdomain = host.split(".")[0];
    const selectedSniffer = await this.snifferService.findBySubdomain(
      subdomain,
    );
    req.headers["x-sharkio-port"] = selectedSniffer?.port.toString();

    if (selectedSniffer != null) {
      return selectedSniffer.downstreamUrl;
    }
    return undefined;
  }

  async adaptIncomingResponse(incomingResponse: http.IncomingMessage) {
    // Body Parsing (assuming JSON for simplicity)
    const body = await new Promise((resolve, reject) => {
      let bodyChunks: Uint8Array[] = [];
      incomingResponse
        .on("data", (chunk) => {
          bodyChunks.push(chunk);
        })
        .on("end", () => {
          const bodyData = Buffer.concat(bodyChunks).toString();

          resolve(bodyData);
        });
    });

    const resObject = {
      headers: incomingResponse.headers,
      statusCode: incomingResponse.statusCode,
      body,
    };

    return resObject;
  }

  getMiddleware() {
    return this.proxyMiddleware;
  }
}
