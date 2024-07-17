import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dgsw2024',
    });
  }

  async validate(payload): Promise<User> {
    const { email } = payload;
    const user = await this.authService.getUser(email);

    return user;
  }
}
