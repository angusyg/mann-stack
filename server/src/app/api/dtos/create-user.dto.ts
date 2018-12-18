import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * User creation endpoint DTO
 *
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public readonly login!: string;

  @IsString()
  @IsNotEmpty()
  public readonly password!: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email!: string;
}
