import { Request as ExpressRequest } from "express";
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { Request } from "../../model/entities/Request";
import { Endpoint } from "../../model/entities/Endpoint";
import { Sniffer } from "../../model/entities/Sniffer";
import { EndpointRepository } from "../../model/repositories/endpoint.repository";
import { RequestRepository } from "../../model/repositories/request.repository";
import { ResponseRepository } from "../../model/repositories/response.repository";

export class EndpointService {
  constructor(
    private readonly repository: EndpointRepository,
    private readonly requestRepository: RequestRepository,
    private readonly responseRepository: ResponseRepository
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
      order: {
        createdAt: "DESC",
      },
    });

    return requests;
  }

  async getById(userId: string, id: string) {
    return this.repository.repository.findOne({
      where: { userId, id },
    });
  }

  async createFromExpressReq(
    req: ExpressRequest,
    snifferId: string,
    userId: string
  ) {
    const newRequest = this.repository.repository.create({
      snifferId,
      userId,
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
    userId: string
  ) {
    const newRequest = this.repository.repository.create({
      snifferId,
      userId,
      url,
      method,
      headers,
      body,
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

    return this.createFromExpressReq(req, snifferId, userId);
  }

  async addInvocation(request: Partial<Omit<Request, "sniffer">>) {
    const theInvocation = this.requestRepository.repository.create({
      endpointId: request.id,
      snifferId: request.snifferId,
      userId: request.userId,
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
        userId: endpoint.userId,
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

  async getInvocationsByUser(
    userId: string,
    limit: number,
    statusCodes: string[],
    methods: string[],
    url: string,
    fromDate: Date | undefined,
    toDate: Date | undefined
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
        userId,
        method: methods === undefined ? undefined : In(methods),
        url: url === undefined ? undefined : Like(`%${url}%`),
        createdAt,
        responses: {
          status: statusCodes === undefined ? undefined : In(statusCodes),
        },
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

  async getInvocationsBySnifferId(userId: string, snifferId: Sniffer["id"]) {
    const invocations = await this.requestRepository.repository.find({
      where: {
        userId,
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

  async getInvocationById(id: string, userId: string) {
    const invocation = await this.requestRepository.repository.findOne({
      relations: {
        responses: true,
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
    let response;
    const responses = invocation.responses;
    if (responses && responses.length > 0) {
      response = responses[0];
    }

    return { ...invocation, response };
  }
}

export default EndpointService;
