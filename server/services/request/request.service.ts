import axios from "axios";
import { useLog } from "../../lib/log";
import { RequestRepository } from "../../model/repositories/request.repository";
import https from "https";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
type ExecutionType = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: any;
  subdomain: string;
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async execute({ method, url, headers, body, subdomain }: ExecutionType) {
    log.info({
      method,
      url: `https://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
      headers,
      body,
      subdomain,
    });
    const newHeaders = Object.entries(headers)
      .filter(([key, _]) => key !== "host" && key !== "content-length")
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

    const res = await axios
      .request({
        method,
        url: `http://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
        headers: newHeaders,
        data: method === "GET" ? undefined : body,
        // httpsAgent: agent,
      })
      .catch((e) => {
        log.error(e);
        return e.response;
      });
    return res;
  }

  async getByTestExecutionId(testExecutionId: string) {
    return this.requestRepository.repository.findOne({
      where: {
        testExecutionId,
      },
      relations: ["response"],
    });
  }
}
