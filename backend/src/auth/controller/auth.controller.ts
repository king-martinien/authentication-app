import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { GoogleGuard } from '../guard/google.guard';
import { Request, Response } from 'express';

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
  @UseGuards(GoogleGuard)
  googleSignin() {
    return { response: 'Google Signin' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this._authService.googleSignin(req.user as CreateUserDto, res);
  }

  @Get('test')
  @UseGuards(JwtGuard)
  test() {
    this._logger.verbose(`Calling guarded test endpoint`);
    return { response: 'Test response' };
  }
}
