import { RequestRepository } from "../../model/request/request.model";
import { Request as ExpressRequest } from "express";

type TreeNodeKey = string;
interface RequestTreeNode {
  name: TreeNodeKey;
  next?: Record<TreeNodeKey, RequestTreeNode>;
}

class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  async getAll(snifferId: string) {
    const requests = await this.repository.repository.find({
      where: {
        snifferId,
      },
    });

    return requests;
  }

  async getRequestsTree(snifferId: string) {
    const requests = await this.getAll(snifferId);

    const result = {
      name: "/",
    } as RequestTreeNode;

    for (const request of requests) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");

      // Ensure the URL path is mapped to the current leaf
      let currentLevel = result;
      for (const part of pathParts) {
        // Ignore the main part of the URL because it represents root
        if (part === "") {
          continue;
        }

        if (currentLevel.next === undefined) {
          currentLevel.next = {};
        }

        if (currentLevel.next[part] !== undefined) {
          currentLevel.next[part] = {
            name: part,
          };
        }

        currentLevel = currentLevel.next[part];
      }
    }

    return result;
  }

  async add(req: ExpressRequest, snifferId?: string, userId?: string) {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    const newRequest = this.repository.repository.create({
      url: fullUrl,
      body: req.body,
      headers: req.headers,
      method: req.method,
      snifferId,
      userId,
    });
    await this.repository.repository.save(newRequest);
  }

  async remove() {}

  async update() {}
}

export default RequestService;
