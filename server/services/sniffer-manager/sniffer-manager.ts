import { Sniffer, SnifferRepository } from "../../model/sniffer/sniffers.model";
import { CreateSnifferDTO } from "../../dto/in/create-sniffer.dto";
import { EditSnifferDTO } from "../../dto/in";

export class SnifferManager {
  constructor(private readonly snifferRepository: SnifferRepository) {}

  async getSniffer(userId: string, id: string) {}
  async getUserSniffers(userId: string): Promise<Sniffer[]> {
    return this.snifferRepository.findByUserId(userId);
  }
  async createSniffer(snifferConfig: CreateSnifferDTO): Promise<Sniffer> {
    const snifferEntity =
      await this.snifferRepository.repository.create(snifferConfig);
    const newSniffer =
      await this.snifferRepository.repository.save(snifferEntity);
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
  async startSniffer(userId: string, id: string) {}
  async stopSniffer(userId: string, id: string) {}
}
