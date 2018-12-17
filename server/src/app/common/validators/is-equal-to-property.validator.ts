import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Returns a validator to check if a property is equal to another property of object
 *
 * @export
 * @param {string} property name of property to test against
 * @param {ValidationOptions} [validationOptions] validation options
 * @returns {(object: any, propertyName: string) => void} validator
 */
export function IsEqualToProperty(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualToProperty',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        /**
         * Validates property value
         *
         * @param {*} value property value
         * @param {ValidationArguments} args validation arguments
         * @returns {boolean} true if property equals the given property value, false otherwise
         */
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' && typeof relatedValue === 'string' && value === relatedValue;
        },
      },
    });
  };
}
