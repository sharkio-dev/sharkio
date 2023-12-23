import { DataSource, Repository } from "typeorm";
import { Users } from "../entities/Users";

class UserRepository {
  repository: Repository<Users>;
  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(Users);
  }

  getByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  getById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async upsert(user: Users) {
    return this.repository.save(user);
  }
}

export default UserRepository;
