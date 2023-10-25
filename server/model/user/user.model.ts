import { Column, DataSource, Entity, PrimaryColumn, Repository } from "typeorm";

@Entity()
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

  upsert(id: string, email: string) {
    return this.repository.save({ id, email });
  }
}

export default UserRepository;
