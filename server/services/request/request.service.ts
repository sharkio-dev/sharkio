import axios from "axios";
import { useLog } from "../../lib/log";

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
  async execute({ method, url, headers, body, subdomain }: ExecutionType) {
    return await axios
      .request({
        method,
        url: `http://${subdomain}.${process.env.PROXY_SERVER_DOMAIN}` + url,
        headers,
        data: body,
      })
      .catch((e) => {
        log.error(e);
      });
  }
}
