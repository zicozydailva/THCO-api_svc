import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ActionEnum, Subject } from 'src/interfaces/roles.interface';


export type RequiredPermission = [ActionEnum, Subject];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

export const CheckPermissions = (...params: RequiredPermission[]): CustomDecorator<string> =>
  SetMetadata(PERMISSION_CHECKER_KEY, params);
