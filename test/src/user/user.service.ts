import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  findOne(sub: any) {
    throw new Error('Method not implemented.');
  }
  findById(sub: any) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  


  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(createUserDTO);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
