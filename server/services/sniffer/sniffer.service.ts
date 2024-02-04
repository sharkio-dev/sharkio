import { CreateSnifferDTO } from "../../dto/in/create-sniffer.dto";
import { EditSnifferDTO } from "../../dto/in";
import randomString from "random-string";
import { SnifferRepository } from "../../model/repositories/sniffers.repository";
import { Sniffer } from "../../model/entities/Sniffer";

export class SnifferService {
  constructor(private readonly snifferRepository: SnifferRepository) {}

  async getSniffer(ownerId: string, id: string) {
    return this.snifferRepository.getById(ownerId, id);
  }

  async getOwnerSniffers(ownerId: string): Promise<Sniffer[]> {
    return this.snifferRepository.findByOwnerId(ownerId);
  }

  async getUserSniffersByPorts(
    ownerId: string,
    ports: number[],
  ): Promise<Sniffer[]> {
    return this.snifferRepository.findByPorts(ownerId, ports);
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

    const newSniffer =
      await this.snifferRepository.repository.save(snifferEntity);
    return newSniffer;
  }

  async editSniffer(newConfig: EditSnifferDTO) {
    const res = await this.snifferRepository.repository
      .createQueryBuilder()
      .update(Sniffer)
      .set(newConfig)
      .where("id = :id AND ownerId = :ownerId", {
        id: newConfig.id,
        ownerId: newConfig.ownerId,
        name: newConfig?.name,
        downstreamUrl: newConfig.downstreamUrl,
      })
      .returning("*")
      .execute();
    return res.raw[0];
  }

  async removeSniffer(ownerId: string, id: string) {
    return this.snifferRepository.repository
      .createQueryBuilder()
      .delete()
      .from(Sniffer)
      .where("id = :id AND ownerId = :ownerId", { id, ownerId })
      .execute();
  }

  async findBySubdomain(subdomain: string) {
    return this.snifferRepository.findBySubdomain(subdomain);
  }

  async findByDownstream(url: string) {
    return this.snifferRepository.findByDownstream(url);
  }

  async findByName(ownerId: string, name: string) {
    return this.snifferRepository.findByName(ownerId, name);
  }

  async upsertLocalSniffers(
    ownerId: string,
    ports: number[],
    downstreamUrl: string,
  ) {
    const existingSniffers = await this.getUserSniffersByPorts(ownerId, ports);

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
          ownerId,
          port,
        });
      }),
    );

    const editedSniffers = await Promise.all(
      existingSniffers.map(async (sniffer) => {
        return this.editSniffer({
          id: sniffer.id,
          downstreamUrl,
          ownerId,
          name: sniffer.name || "",
          subdomain: sniffer.subdomain,
        });
      }),
    );

    return [...newSniffers, ...editedSniffers];
  }
}
