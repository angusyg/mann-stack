import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  public readonly login!: string;

  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
