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

    // Check if the email is already in use
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
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

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      message: 'Login successful',
      token,
    };
  }
}
