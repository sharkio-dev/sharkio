import { RequestRepository } from "../../model/request/request.model";
import { Request as ExpressRequest } from "express";

type TreeNodeKey = string;
interface RequestTreeNode {
  name: TreeNodeKey;
  callCount: number;
  metadata: RequestMetadata;
  next?: Record<TreeNodeKey, RequestTreeNode>;
}

interface RequestMetadata {
  suspectedPath: boolean;
}

export class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  async getByUser(userId: string) {
    return this.repository.repository.find({
      where: {
        userId,
      },
    });
  }

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
    console.log("requests", requests);

    const result = {
      name: "/",
      metadata: {
        suspectedPath: true,
      },
      callCount: 0,
    } as RequestTreeNode;

    for (const request of requests) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");

      // Ensure the URL path is mapped to the current root
      let currentLevel = result;
      for (const part of pathParts) {
        // Ignore the main part of the URL because it represents root
        if (part === "") {
          continue;
        }

        if (currentLevel.next === undefined) {
          currentLevel.next = {};
        }

        if (currentLevel.next[part] === undefined) {
          currentLevel.next[part] = {
            name: part,
            metadata: {
              suspectedPath: true,
            },
            callCount: 0,
          };
        }

        currentLevel = currentLevel.next[part];
      }

      // Update the corresponding endpoint
      ++currentLevel.callCount;
      currentLevel.metadata.suspectedPath = false;
    }

    return result;
  }

  async create(req: ExpressRequest, snifferId: string, userId: string) {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const newRequest = this.repository.repository.create({
      url: fullUrl,
      body: req.body,
      headers: req.headers,
      method: req.method,
      snifferId,
      userId,
    });
    return this.repository.repository.save(newRequest);
  }

  async findOrCreate(req: ExpressRequest, snifferId: string, userId: string) {
    const request = await this.repository.repository.findOne({
      where: {
        snifferId,
        userId,
      },
    });

    if (request !== null) {
      return request;
    }

    return this.create(req, snifferId, userId);
  }
}

export default RequestService;
