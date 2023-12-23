import { CreateSnifferDTO } from "../../dto/in/create-sniffer.dto";
import { EditSnifferDTO } from "../../dto/in";
import randomString from "random-string";
import { SnifferRepository } from "../../model/repositories/sniffers.repository";
import { Sniffer } from "../../model/entities/Sniffer";

export class SnifferService {
  constructor(private readonly snifferRepository: SnifferRepository) {}

  async getSniffer(userId: string, id: string) {
    return this.snifferRepository.repository.findOne({
      where: {
        userId,
        id,
      },
    });
  }

  async getUserSniffers(userId: string): Promise<Sniffer[]> {
    return this.snifferRepository.findByUserId(userId);
  }

  async getUserSniffersByPorts(
    userId: string,
    ports: number[]
  ): Promise<Sniffer[]> {
    return this.snifferRepository.findByPorts(userId, ports);
  }

  async getAllSniffers(): Promise<Sniffer[]> {
    return this.snifferRepository.repository.find();
  }

  async createSniffer(snifferConfig: CreateSnifferDTO): Promise<Sniffer> {
    const subdomain = snifferConfig.subdomain
      ? snifferConfig.subdomain
      : `${snifferConfig.downstreamUrl}-${randomString({
          length: 5,
        }).toLowerCase()}`;

    const snifferEntity: Sniffer = this.snifferRepository.repository.create({
      ...snifferConfig,
      subdomain,
    });

    const newSniffer = await this.snifferRepository.repository.save(
      snifferEntity
    );
    return newSniffer;
  }

  async editSniffer(newConfig: EditSnifferDTO) {
    const res = await this.snifferRepository.repository
      .createQueryBuilder()
      .update(Sniffer)
      .set(newConfig)
      .where("id = :id AND userId = :userId", {
        id: newConfig.id,
        userId: newConfig.userId,
        name: newConfig?.name,
        downstreamUrl: newConfig.downstreamUrl,
      })
      .returning("*")
      .execute();
    return res.raw[0];
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

  async findByDownstream(url: string) {
    return this.snifferRepository.findByDownstream(url);
  }

  async findByName(userId: string, name: string) {
    return this.snifferRepository.findByName(userId, name);
  }

  async upsertLocalSniffers(
    userId: string,
    ports: number[],
    downstreamUrl: string
  ) {
    const existingSniffers = await this.getUserSniffersByPorts(userId, ports);

    const newPorts = ports.filter((port) => {
      return !existingSniffers.find((sniffer) => port === sniffer.port);
    });

    const newSniffers = await Promise.all(
      newPorts.map(async (port) => {
        return this.createSniffer({
          downstreamUrl,
          name: `local-${port}`,
          subdomain: `local-${port}-${randomString({
            length: 5,
          }).toLowerCase()}`,
          userId,
          port,
        });
      })
    );

    const editedSniffers = await Promise.all(
      existingSniffers.map(async (sniffer) => {
        return this.editSniffer({
          id: sniffer.id,
          downstreamUrl,
          userId,
          name: sniffer.name || "",
          subdomain: sniffer.subdomain,
        });
      })
    );

    return [...newSniffers, ...editedSniffers];
  }
}
