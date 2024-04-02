import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';

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
}
