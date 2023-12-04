import parse, { ResultJSON } from "@bany/curl-to-json";
import { EndpointService } from "../endpoint/endpoint.service";

export class ImportService {
  constructor(private readonly endpointService: EndpointService) {}

  async importFromCurl(userId: string, snifferId: string, curlCommand: string) {
    const curlObject: ResultJSON = parse(curlCommand);
    const url = new URL(curlObject.url);

    const newEndpoint = await this.endpointService.create(
      url.pathname,
      curlObject.method ?? "GET",
      curlObject.header ?? {},
      curlObject.data,
      snifferId,
      userId,
    );

    return newEndpoint;
  }
}
