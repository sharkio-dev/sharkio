import axios from "axios";
import { useLog } from "../../lib/log";
import { RequestRepository } from "../../model/request/request.model";
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

export class RequestService {
  private agent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(private readonly requestRepository: RequestRepository) {}

  async execute({ method, url, headers, body, subdomain }: ExecutionType) {
    console.log("execute", {
      method,
      url: `https://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
      headers,
      body,
      subdomain,
    });
    await axios
      .request({
        method,
        url: `https://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
        headers,
        data: body,
        httpsAgent: this.agent,
      })
      .catch((e) => {
        log.error(e);
      });
    console.log("done!");
    return;
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
