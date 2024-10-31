import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum UserType {
  GURU = 'GURU',
  ORANG_TUA = 'ORANG_TUA',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([UserType.GURU, UserType.ORANG_TUA])
  user_type: UserType;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  alamat: string;
}
