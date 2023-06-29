import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userEmail: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(userEmail);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userEmail: user.userEmail, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
