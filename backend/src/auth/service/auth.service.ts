import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Observable } from 'rxjs';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly _userService: UserService) {}

  signup(createUserDto: CreateUserDto): Observable<User> {
    return this._userService.createUser(createUserDto);
  }
}
