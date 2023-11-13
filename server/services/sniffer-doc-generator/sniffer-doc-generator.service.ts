import EndpointService from "../endpoint/endpoint.service";
import { SnifferService } from "../sniffer/sniffer.service";
import { generateOpenApi } from "../code-generator/open-api-generator";
import swaggerUi from "swagger-ui-express";

export class SnifferDocGenerator {
  constructor(
    private readonly snifferManager: SnifferService,
    private readonly requestService: EndpointService
  ) {}

  async generateDocForSniffer(userId: string, snifferId: string) {
    const sniffer = await this.snifferManager.getSniffer(userId, snifferId);
    const snifferRequests = await this.requestService.getBySnifferId(
      userId,
      snifferId
    );

    const generatedSwagger = generateOpenApi(snifferRequests);
    //@ts-ignore
    generatedSwagger.servers = [
      {
        url: `https://${sniffer?.subdomain}.localhost.sharkio.dev`,
      },
      {
        url: `https://${sniffer?.subdomain}.sharkio.dev`,
      },
    ];

    return generatedSwagger;
  }
}
