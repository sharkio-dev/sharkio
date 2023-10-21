import { Entity, PrimaryColumn } from "typeorm";
import { useLog } from "../../lib/log";
import { SnifferConfig } from "../../types";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class SnifferRepository {
  constructor() {}

  // async getAllUsersSniffers() {}
  // async getUserSniffers() {}
  // async update() {}
  // async addSniffer() {}
  // async removeSniffer() {}
  // async setIsStarted() {}
}

@Entity()
export class Sniffer {
  @PrimaryColumn()
  id: number;
}
