import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  newUsername: string;

  @IsString()
  newEmail: string;

  @IsString()
  newPassword: string;
}
