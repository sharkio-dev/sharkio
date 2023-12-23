import { DataSource, Repository } from "typeorm";
import { User } from "../entities/Users";

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

  async upsert(user: User) {
    return this.repository.save(user);
  }
}

export default UserRepository;
