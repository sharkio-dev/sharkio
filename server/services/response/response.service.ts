import {
  Response,
  ResponseRepository,
} from "../../model/response/response.model";

export class ResponseService {
  constructor(private readonly responseRepository: ResponseRepository) {}

  async addResponse(interceptedResponse: Partial<Response>) {
    const response =
      this.responseRepository.repository.create(interceptedResponse);
    return await this.responseRepository.repository.save(response);
  }
}

export default ResponseService;
