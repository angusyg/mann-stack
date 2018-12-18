import { IsString } from 'class-validator';

/**
 * Login endpoint DTO
 *
 * @export
 * @class LoginDto
 */
export class LoginDto {
  @IsString()
  public readonly login!: string;

  @IsString()
  public readonly password!: string;
}
