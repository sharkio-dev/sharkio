import { Request as ExpressRequest } from "express";
import { InvocationRepository } from "../../model/invocation/invocation.model";
import {
  Endpoint,
  EndpointRepository,
} from "../../model/endpoint/endpoint.model";
import { Sniffer } from "../../model/sniffer/sniffers.model";

type TreeNodeKey = string;
interface EndpointTreeNode {
  name: TreeNodeKey;
  callCount: number;
  metadata: EndpointMetadata;
  next?: Record<TreeNodeKey, EndpointTreeNode>;
}

interface EndpointMetadata {
  suspectedPath: boolean;
}

export class EndpointService {
  constructor(
    private readonly repository: EndpointRepository,
    private readonly invocationRepository: InvocationRepository,
  ) {}

  async getByUser(userId: string, limit: number) {
    return this.repository.repository.find({
      where: {
        userId,
      },
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getBySnifferId(userId: string, snifferId: Sniffer["id"]) {
    const requests = await this.repository.repository.find({
      where: {
        userId,
        snifferId,
      },
    });

    return requests;
  }

  async getById(id: string) {
    return this.repository.repository.findOne({ where: { id } });
  }

  async getRequestsTree(snifferId: string) {
    const requests = await this.repository.repository.find({
      where: {
        snifferId,
      },
    });

    const result = {
      name: "/",
      metadata: {
        suspectedPath: true,
      },
      callCount: 0,
    } as EndpointTreeNode;

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
    const newRequest = this.repository.repository.create({
      snifferId,
      userId,
      url: req.path,
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
    return this.repository.repository.save(newRequest);
  }

  async findOrCreate(req: ExpressRequest, snifferId: string, userId: string) {
    const request = await this.repository.repository.findOne({
      where: {
        snifferId,
        userId,
        url: req.path,
        method: req.method,
      },
    });

    if (request !== null) {
      return request;
    }

    return this.create(req, snifferId, userId);
  }

  async addInvocation(request: Endpoint) {
    const theInvocation = this.invocationRepository.repository.create({
      requestId: request.id,
      snifferId: request.snifferId,
      userId: request.userId,
      method: request.method,
      body: request.body,
      headers: request.headers,
      url: request.url,
    });

    return this.invocationRepository.repository.save(theInvocation);
  }

  async getInvocations(request: Endpoint) {
    const invocations = await this.invocationRepository.repository.find({
      relations: {
        response: true,
      },
      where: {
        requestId: request.id,
        snifferId: request.snifferId,
        userId: request.userId,
        method: request.method,
        url: request.url,
      },
    });

    // make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response = undefined;
      const responses = invocation.response;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationsByUser(userId: string, limit: number) {
    const invocations = await this.invocationRepository.repository.find({
      relations: {
        response: true,
      },
      where: {
        userId,
      },
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    // make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response = undefined;
      const responses = invocation.response;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationsBySnifferId(userId: string, snifferId: Sniffer["id"]) {
    const invocations = await this.invocationRepository.repository.find({
      relations: {
        response: true,
      },
    });

    // make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response = undefined;
      const responses = invocation.response;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationById(id: string, userId: string) {
    const invocation = await this.invocationRepository.repository.findOne({
      relations: {
        response: true,
      },
      where: {
        id,
        userId,
      },
    });
    if (!invocation) {
      return undefined;
    }

    // make sure only one response is returned
    let response = undefined;
    const responses = invocation.response;
    if (responses && responses.length > 0) {
      response = responses[0];
    }

    return { ...invocation, response };
  }
}

export default EndpointService;
