import { Request as ExpressRequest } from "express";
import { Endpoint } from "../../model/entities/Endpoint";
import { Request } from "../../model/entities/Request";
import { Sniffer } from "../../model/entities/Sniffer";
import { EndpointRepository } from "../../model/repositories/endpoint.repository";
import { RequestRepository } from "../../model/repositories/request.repository";
import { ResponseRepository } from "../../model/repositories/response.repository";
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

export class EndpointService {
  constructor(
    private readonly repository: EndpointRepository,
    private readonly requestRepository: RequestRepository,
    private readonly responseRepository: ResponseRepository
  ) {}

  async getByOwner(ownerId: string, limit: number) {
    return this.repository.repository.find({
      where: {
        ownerId: ownerId,
      },
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getBySnifferId(ownerId: string, snifferId: Sniffer["id"]) {
    const requests = await this.repository.repository.find({
      where: {
        ownerId,
        snifferId,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return requests;
  }

  async getById(ownerId: string, id: string) {
    return this.repository.repository.findOne({
      where: { ownerId, id },
    });
  }

  async createFromExpressReq(
    req: ExpressRequest,
    snifferId: string,
    ownerId: string
  ) {
    const newRequest = this.repository.repository.create({
      snifferId,
      ownerId,
      url: req.path,
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.body,
    });
    return this.repository.repository.save(newRequest);
  }

  async create(
    url: string,
    method: string,
    headers: Record<string, any>,
    body: string,
    snifferId: string,
    ownerId: string
  ) {
    const newRequest = this.repository.repository.create({
      snifferId,
      ownerId,
      url,
      method,
      headers,
      body,
    });
    return this.repository.repository.save(newRequest);
  }

  async findOrCreate(req: ExpressRequest, snifferId: string, ownerId: string) {
    const request = await this.repository.repository.findOne({
      where: {
        snifferId,
        ownerId,
        url: req.path,
        method: req.method,
      },
    });

    if (request !== null) {
      return request;
    }

    return this.createFromExpressReq(req, snifferId, ownerId);
  }

  async addInvocation(request: Partial<Omit<Request, "sniffer">>) {
    const theInvocation = this.requestRepository.repository.create({
      endpointId: request.id,
      snifferId: request.snifferId,
      ownerId: request.ownerId,
      method: request.method,
      body: request.body,
      headers: request.headers,
      url: request.url,
      testExecutionId: request.testExecutionId,
    });

    return this.requestRepository.repository.save(theInvocation);
  }

  async getInvocations(endpoint: Endpoint) {
    const invocations = await this.requestRepository.repository.find({
      relations: {
        responses: true,
      },
      where: {
        endpointId: endpoint.id,
        snifferId: endpoint.snifferId,
        ownerId: endpoint.ownerId,
        method: endpoint.method,
        url: endpoint.url,
      },
      take: 100,
      order: {
        createdAt: "DESC",
      },
    });

    // make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response;
      const responses = invocation.responses;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationsByOwner(
    ownerId: string,
    limit: number,
    statusCodes: string[],
    methods: string[],
    url: string,
    fromDate: Date | undefined,
    toDate: Date | undefined,
    proxies?: string[]
  ) {
    let createdAt;

    if (fromDate !== undefined && toDate !== undefined) {
      createdAt = Between(fromDate, toDate);
    } else if (fromDate !== undefined) {
      createdAt = MoreThanOrEqual(fromDate);
    } else if (toDate !== undefined) {
      createdAt = LessThanOrEqual(toDate);
    }

    const invocations = await this.requestRepository.repository.find({
      where: {
        ownerId,
        method: methods === undefined ? undefined : In(methods),
        url: url === undefined ? undefined : Like(`%${url}%`),
        createdAt,
        responses: {
          status: statusCodes === undefined ? undefined : In(statusCodes),
        },
        snifferId: proxies === undefined ? undefined : In(proxies),
      },
      relations: {
        responses: true,
      },
      select: {
        responses: {
          status: true,
        },
      },
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    //make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response;
      const responses = invocation.responses;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationsBySnifferId(ownerId: string, snifferId: Sniffer["id"]) {
    const invocations = await this.requestRepository.repository.find({
      where: {
        ownerId,
        snifferId,
      },
      take: 100,
      relations: {
        responses: true,
      },
    });

    // make sure only one response is returned
    const mapped = invocations.map((invocation) => {
      let response;
      const responses = invocation.responses;
      if (responses && responses.length > 0) {
        response = responses[0];
      }
      return { ...invocation, response };
    });

    return mapped;
  }

  async getInvocationById(id: string, ownerId: string) {
    const invocation = await this.requestRepository.repository.findOne({
      relations: {
        responses: true,
      },
      where: {
        id,
        ownerId,
      },
    });
    if (!invocation) {
      return undefined;
    }

    // make sure only one response is returned
    let response;
    const responses = invocation.responses;
    if (responses && responses.length > 0) {
      response = responses[0];
    }

    return { ...invocation, response };
  }
}

export default EndpointService;
