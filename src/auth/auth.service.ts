import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  async validateUserById(id: number): Promise<User | null> {
    // This query will find data based on is which is in the token.
    return await this.userModel.findOne({ where: { id } });
  }
}
