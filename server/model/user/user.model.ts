import { Column, DataSource, Entity, JoinTable, ManyToMany, PrimaryColumn, Repository } from "typeorm";

import { useLog } from "../../lib/log";
import { Workspace } from "../workSpace/workSpace.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

@Entity({ name: "users", schema: "auth" })
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  email: string;
}

class UserRepository {
  repository: Repository<User>;
  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(User);
  }

  getByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}

export default UserRepository;
