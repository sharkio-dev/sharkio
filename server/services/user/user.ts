import UserRepository, { User } from "../../model/user/user.model";

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getByEmail(email: string) {
    return this.repository.getByEmail(email);
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async upsertUser(user: User) {
    return this.repository.upsert(user);
  }
}

export default UserService;
