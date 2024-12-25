import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO);
  }
}
