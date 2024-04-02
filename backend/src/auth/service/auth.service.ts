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

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name, { timestamp: true });

  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  signup(createUserDto: CreateUserDto): Observable<User> {
    return this._userService.createUser(createUserDto);
  }

  signin(loginCredentials: LoginCredentialsDto) {
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
}
