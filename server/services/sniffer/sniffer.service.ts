import { Sniffer, SnifferRepository } from "../../model/sniffer/sniffers.model";
import { CreateSnifferDTO } from "../../dto/in/create-sniffer.dto";
import { EditSnifferDTO } from "../../dto/in";

export class SnifferService {
  constructor(private readonly snifferRepository: SnifferRepository) {}

  async getSniffer(userId: string, id: string) {}
  async getUserSniffers(userId: string): Promise<Sniffer[]> {
    return this.snifferRepository.findByUserId(userId);
  }
  async getAllSniffers(): Promise<Sniffer[]> {
    return this.snifferRepository.repository.find();
  }
  async createSniffer(snifferConfig: CreateSnifferDTO): Promise<Sniffer> {
    const snifferEntity =
      this.snifferRepository.repository.create(snifferConfig);
    const newSniffer = await this.snifferRepository.repository.save(
      snifferEntity,
    );
    return newSniffer;
  }
  async editSniffer(newConfig: EditSnifferDTO) {
    return this.snifferRepository.repository
      .createQueryBuilder()
      .update(Sniffer)
      .set(newConfig)
      .where("id = :id AND userId = :userId", {
        id: newConfig.id,
        userId: newConfig.userId,
        name: newConfig.name,
        downstreamUrl: newConfig.downstreamUrl,
      })
      .execute();
  }
  async removeSniffer(userId: string, id: string) {
    return this.snifferRepository.repository
      .createQueryBuilder()
      .delete()
      .from(Sniffer)
      .where("id = :id AND userId = :userId", { id, userId })
      .execute();
  }

  async findBySubdomain(subdomain: string) {
    return this.snifferRepository.findBySubdomain(subdomain);
  }
  async findByName(userId: string, name: string) {
    return this.snifferRepository.findByName(userId, name);
  }

  async startSniffer(userId: string, id: string) {}
  async stopSniffer(userId: string, id: string) {}
}
