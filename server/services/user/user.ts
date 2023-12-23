import UserRepository from "../../model/repositories/user.repository";
import { Users } from "../../model/entities/Users";

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getByEmail(email: string) {
    return this.repository.getByEmail(email);
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async upsertUser(user: Users) {
    return this.repository.upsert(user);
  }
}

export default UserService;
