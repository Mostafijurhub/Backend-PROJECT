import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.register(createUserDTO);
  }

  @Post('login')
  async login(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.login(createUserDTO);
  }
}
