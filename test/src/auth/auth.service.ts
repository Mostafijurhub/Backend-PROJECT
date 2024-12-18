import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';  
import { UserService } from '../user/user.service';  
import { CreateUserDTO } from '../user/user.dto';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  
  async createToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    const secretKey = 'your-secret-key'; 
    return jwt.sign(payload, secretKey, { expiresIn: '7d' }); 
  }

  
  async register(createUserDTO: CreateUserDTO, res: FastifyReply) {
    const user = await this.userService.createUser(createUserDTO); 
    const token = await this.createToken(user); 

    res.setCookie('token', token, {
      httpOnly: true,  
      secure: false,   
      maxAge: 1000 * 60 * 60 * 24 * 7  
    });

    return res.status(201).send({ user, message: 'User registered successfully' });
  }

  
  async verifyToken(token: string): Promise<any> {
    const secretKey = 'your-secret-key';  
    try {
      return jwt.verify(token, secretKey); 
    } catch (e) {
      throw new Error('Invalid token'); 
    }
  }
}
