import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';

@Controller('auth')
export class AuthController {
  private readonly _logger = new Logger(AuthController.name);

  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    this._logger.verbose(
      `Creating a new user : CreateUserDto => ${JSON.stringify(createUserDto)}`,
    );
    return this._authService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() loginCredentials: LoginCredentialsDto) {
    this._logger.verbose(`Signing in the user ${loginCredentials.email}`);
    return this._authService.signin(loginCredentials);
  }
}
