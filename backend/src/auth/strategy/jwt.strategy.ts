import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../service/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    _configService: ConfigService,
    private readonly _authService: AuthService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: _configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const user = await this._userRepository.findOneBy({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
