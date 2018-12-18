import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { AUTH_INVITATION_CODE } from '../constants';
import { ConfigService } from '../services';


/**
 * Constraint to validate user invitation code with application invitation code
 *
 * @export
 * @class IsValidInvitationCodeConstraint
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint()
@Injectable()
export class IsValidInvitationCodeConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly _configService: ConfigService) {}

  /**
   * Validates user invitation code
   *
   * @param {string} invitationCode user invitation code to test
   * @returns {boolean} true if user code is valid, false otherwise
   * @memberof IsValidInvitationCodeConstraint
   */
  public validate(invitationCode: string): boolean {
    const code = this._configService.get(AUTH_INVITATION_CODE);
    if (code && code !== '') return invitationCode === code;
    return true;
  }

  /**
   * Returns default error message
   *
   * @returns {string} default error message
   * @memberof IsValidInvitationCodeConstraint
   */
  public defaultMessage(): string {
    return 'Invitation code is not valid';
  }
}

/**
 * Returns a validator to validate user invitation code
 *
 * @export
 * @param {ValidationOptions} [validationOptions] validation options
 * @returns {(object: any, propertyName: string) => void} invitation code validator
 */
export function IsValidInvitationCode(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void {
  return (object: any, propertyName: string) => {
       registerDecorator({
           target: object.constructor,
           propertyName,
           options: validationOptions,
           constraints: [],
           validator: IsValidInvitationCodeConstraint
       });
  };
}
