import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('T_USERS')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fullname' })
  fullname: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;
}
