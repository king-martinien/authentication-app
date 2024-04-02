import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { catchError, from, map, switchMap } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name, { timestamp: true });

  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const { fullname, email, password } = createUserDto;
    const generatedPassword$ = from(bcrypt.genSalt());
    const hashedPassword$ = generatedPassword$.pipe(
      switchMap((generatedSalt) => {
        return from(bcrypt.hash(password, generatedSalt));
      }),
    );
    return hashedPassword$.pipe(
      switchMap((hashedPassword) => {
        const user = this._userRepository.create({
          fullname,
          email,
          password: hashedPassword,
        });
        return from(this._userRepository.save(user)).pipe(
          map((user) => {
            this._logger.log(`User ${email} Created SuccessFully`);
            return user;
          }),
        );
      }),
      catchError((err) => {
        if (err.code === '23505') {
          this._logger.error(`User with email ${email} already exit.`);
          throw new ConflictException(`User with email ${email} already exit.`);
        }
        this._logger.error(
          `Unexpected error when creating the user ${email}`,
          err.stack,
        );
        throw new InternalServerErrorException();
      }),
    );
  }
}
