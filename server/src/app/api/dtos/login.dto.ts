import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Login endpoint DTO
 *
 * @export
 * @class LoginDto
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  public readonly login!: string;

  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
