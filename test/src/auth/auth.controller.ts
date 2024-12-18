import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/user.dto';
import { FastifyReply, FastifyRequest } from 'fastify'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO, @Res() res: FastifyReply) {
    return this.authService.register(createUserDTO, res);
  }


  @Post('verify')
  async verifyToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const token = req.cookies['token']; 

    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    try {
      const decoded = await this.authService.verifyToken(token);  
      return res.status(200).send(decoded); 
    } catch (e) {
      return res.status(401).send({ message: 'Invalid token' });
    }
  }
}
