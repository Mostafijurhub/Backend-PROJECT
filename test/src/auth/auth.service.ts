import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDTO: CreateUserDTO) {
    const { email, password } = createUserDTO;

   
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: { email: newUser.email },
    };
  }

  async login(createUserDTO: CreateUserDTO) {
    const { email, password } = createUserDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      message: 'Login successful',
      token,
    };
  }
}
