import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { JwtGuard } from '../guard/jwt.guard';

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
  @HttpCode(HttpStatus.OK)
  signin(@Body() loginCredentials: LoginCredentialsDto) {
    this._logger.verbose(`Signing in the user ${loginCredentials.email}`);
    return this._authService.signin(loginCredentials);
  }

  @Get('google/signin')
  googleSignin() {
    return { response: 'Google Signin' };
  }

  @Get('google/redirect')
  googleRedirect() {
    return { response: 'Google Redirect' };
  }

  @Get('test')
  @UseGuards(JwtGuard)
  test() {
    this._logger.verbose(`Calling guarded test endpoint`);
    return { response: 'Test response' };
  }
}
