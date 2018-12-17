import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsEqualToProperty, IsValidInvitationCode } from '../../common/validators';

/**
 * User sign up endpoint DTO
 *
 * @export
 * @class SignupDto
 */
export class SignupDto {
  @IsString()
  public readonly login!: string;

  @IsString()
  public readonly password!: string;

  @IsEqualToProperty('password', { message: 'passwordConf must be equal to password'})
  public readonly passwordConf!: string;

  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @IsValidInvitationCode()
  public readonly invitationCode!: string;
}
