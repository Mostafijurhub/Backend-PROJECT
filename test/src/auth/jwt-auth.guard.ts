import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];  

    if (!token) {
      return false;  
    }

    try {
  
      const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
      request.user = decoded;  
      return true;
    } catch (error) {
      return false;  
    }
  }
}