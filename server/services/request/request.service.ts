import axios from "axios";
import { useLog } from "../../lib/log";
import { RequestRepository } from "../../model/request/request.model";

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
  constructor(private readonly requestRepository: RequestRepository) {}

  async execute({ method, url, headers, body, subdomain }: ExecutionType) {
    await axios
      .request({
        method,
        url: `http://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
        headers,
        data: body,
      })
      .catch((e) => {
        log.error(e);
      });
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
