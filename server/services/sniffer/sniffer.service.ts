import { CreateSnifferDTO } from "../../dto/in/create-sniffer.dto";
import { EditSnifferDTO } from "../../dto/in";
import randomString from "random-string";
import { SnifferRepository } from "../../model/repositories/sniffers.repository";
import { Sniffer } from "../../model/entities/Sniffer";
import { TtlCache } from "../../lib/ttl-cache/ttl-cache";

const SUBDOMAIN_CACHE_TTL_MS = 30_000;

export class SnifferService {
  private readonly subdomainCache = new TtlCache<Sniffer | null>(
    SUBDOMAIN_CACHE_TTL_MS,
  );

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
    this.subdomainCache.delete(newSniffer.subdomain);
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
    this.subdomainCache.clear();
    return res.raw[0];
  }

  async removeSniffer(ownerId: string, id: string) {
    const result = await this.snifferRepository.repository
      .createQueryBuilder()
      .delete()
      .from(Sniffer)
      .where("id = :id AND ownerId = :ownerId", { id, ownerId })
      .execute();
    this.subdomainCache.clear();
    return result;
  }

  async findBySubdomain(subdomain: string) {
    const cached = this.subdomainCache.get(subdomain);
    if (cached !== undefined) return cached;
    const sniffer = await this.snifferRepository.findBySubdomain(subdomain);
    this.subdomainCache.set(subdomain, sniffer);
    return sniffer;
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
