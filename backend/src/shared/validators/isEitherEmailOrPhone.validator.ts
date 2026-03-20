import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEitherEmailOrPhone', async: false })
export class IsEitherEmailOrPhone implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    return !!object.email || !!object.phone;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Для регистрации укажите почту или пароль!';
  }
}
