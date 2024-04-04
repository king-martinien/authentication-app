import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(_configService: ConfigService) {
    super({
      clientID: _configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: _configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: _configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { emails, displayName } = profile;
    const user = {
      email: emails ? emails[0].value : '',
      fullname: displayName,
    };
    done(null, user);
  }
}
