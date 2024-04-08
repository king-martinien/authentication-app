import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
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
          map(() => {
            this._logger.log(`User ${email} Created SuccessFully`);
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

  getUserByEmail(email: string): Observable<User> {
    return from(this._userRepository.findOneBy({ email })).pipe(
      switchMap(async (user) => {
        if (!user) {
          throw new NotFoundException(`User not found with email ${email}`);
        }
        return user;
      }),
    );
  }

  createUserWithGoogle(createUseDto: CreateUserDto) {
    const { email } = createUseDto;
    return from(this._userRepository.findOneBy({ email })).pipe(
      switchMap(async (user) => {
        if (user) {
          this._logger.verbose(
            `There is already a user with email ${email} => Signin in the user...`,
          );
          return user;
        } else {
          this._logger.verbose(
            `There is not a user with email ${email} => Creating the user...`,
          );
          return this.saveUser(createUseDto);
        }
      }),
    );
  }

  saveUser(createUserDto: CreateUserDto) {
    const { email, fullname } = createUserDto;
    const newUser: User = this._userRepository.create({ email, fullname });
    return this._userRepository.save(newUser);
  }
}
