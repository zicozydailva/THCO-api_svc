import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { PASSWORD_PATTERN } from '../constants';
import { IsMatchPattern } from 'src/validators';
import { PaginationDto } from 'src/modules/utils/page-options.dto';
import { UserGender } from 'src/interfaces/strategy.interfaces';

export enum PortalType {
  student = 'student',
  admin = 'admin',
}

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe = false;
}

export class PortalDto {
  @IsEnum(PortalType)
  portal: PortalType = PortalType.student;
}

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class CallbackURLDto {
  @IsUrl({ require_tld: false })
  @IsOptional()
  callbackURL: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN, {
    message: 'Please enter a valid current password',
  })
  password: string;

  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN, {
    message:
      'New password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  newPassword: string;
}

export class UserRegistrationDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s/g, ''))
  username?: string;

  @IsMongoId()
  @IsOptional()
  countryId?: string;
}

export class CreateUserAdminDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s/g, ''))
  username?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsMongoId()
  @IsOptional()
  tenant?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsMongoId()
  @IsOptional()
  countryId?: string;

  @IsOptional()
  countryCode?: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    } else {
      return [];
    }
  })
  programs?: string[] = [];
}

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s/g, ''))
  username?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsMongoId()
  @IsOptional()
  tenant?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsMongoId()
  @IsOptional()
  countryId?: string;

  @IsArray()
  @IsOptional()
  // @Transform(({ value }) => value?.split(',') || [])
  programs?: string[] = [];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s/g, ''))
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar?: string;

  @IsOptional()
  @IsString()
  about?: string;
}

export class EmailConfirmationDto {
  @IsString()
  code: string;
}

export class RefreshTokenDto {
  @IsString()
  token: string;
}

export class TCodeLoginDto {
  @IsString()
  tCode: string;
}

export class GetAllUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => decodeURIComponent(value))
  search?: string;

  @IsOptional()
  @Transform((params) => params.value?.split(','))
  @IsString({ each: true })
  roles?: string[] = [];

  @IsOptional()
  @Transform((params) => params.value?.split(','))
  @IsString({ each: true })
  planIds?: string[] = [];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  populatePlan = false;
}

export class UpdateUserOnboardingDto {
  @IsString()
  @IsOptional()
  gender: UserGender;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  countryId: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
