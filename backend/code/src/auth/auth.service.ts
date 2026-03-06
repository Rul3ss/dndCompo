import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    const refresh_token = this.jwtService.sign(payload, { 
      secret: process.env.JWT_REFRESH_SECRET as string, 
      expiresIn: '7d' 
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Busca usuário e a hash de refresh token
    const user = await this.userService.findByIdWithRefreshToken(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Acesso negado');
    }

    // Compara o token enviado com a hash
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Acesso negado');
    }

    return this.login(user);
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }
}
