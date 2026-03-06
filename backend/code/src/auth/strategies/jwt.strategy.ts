import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Ideally, this secret should be in the .env file. We are hardcoding it for brevity, 
// but in a production environment, you MUST use ConfigService.
export const jwtConstants = {
  secret: process.env.JWT_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT. What we return here gets attached to `req.user`.
    return { userId: payload.sub, email: payload.email };
  }
}
