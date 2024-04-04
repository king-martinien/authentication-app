import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { catchError, Observable, switchMap } from 'rxjs';
import { User } from '../../user/entity/user.entity';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { LoginResponse } from '../interface/login-response.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name, { timestamp: true });

  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  signup(createUserDto: CreateUserDto): Observable<User> {
    return this._userService.createUser(createUserDto);
  }

  signin(loginCredentials: LoginCredentialsDto): Observable<LoginResponse> {
    const { email, password } = loginCredentials;
    return this._userService.getUserByEmail(email).pipe(
      switchMap(async (user) => {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException(`incorrect email or password.`);
        }
        const payload: JwtPayload = { sub: user.id, username: user.email };
        const loginResponse: LoginResponse = {
          accessToken: this._jwtService.sign(payload),
        };
        this._logger.log(`Successfully signed the user ${email}`);
        return loginResponse;
      }),
      catchError((err) => {
        this._logger.error(
          `Error when signing in the user ${email}`,
          err.stack,
        );
        throw new UnauthorizedException();
      }),
    );
  }

  googleSignin(
    createUserDto: CreateUserDto,
    res: Response,
  ): Observable<LoginResponse> {
    return this._userService.createUserWithGoogle(createUserDto).pipe(
      switchMap(async (user) => {
        const payLoad: JwtPayload = { sub: user.id, username: user.email };
        const loginResponse: LoginResponse = {
          accessToken: this._jwtService.sign(payLoad),
        };
        res.cookie('accessToken', loginResponse.accessToken);
        res.redirect(this._configService.get<string>('FRONTEND_URL_REDIRECT')!);
        return loginResponse;
      }),
    );
  }

  validateUser(email: string) {
    console.log('Validating the user...');
    return this._userService.getUserByEmail(email);
  }
}
