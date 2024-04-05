import { Injectable } from '@nestjs/common';
import { TokenHelper } from '../utils/token.utils';
import { IUser } from 'src/interfaces/user.interfaces';
import { UserSessionService } from '../user-session/service';
import { ErrorHelper } from 'src/helpers/error.utils';
import { LoginDto, PortalType, UserRegistrationDto } from './dto/auth.dto';
import { UserLoginStrategy } from 'src/interfaces/strategy.interfaces';
import { RoleNameEnum } from 'src/interfaces/roles.interfaces';
import {
  EMAIL_ALREADY_EXISTS,
  INVALID_EMAIL_OR_PASSWORD,
} from './constants/messages.constant';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { UserDocument } from './entities/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private tokenHelper: TokenHelper,
    private readonly userSessionService: UserSessionService,
    private readonly userService: UserService,
    private encryptHelper: EncryptHelper,
  ) {}

  async signup(payload: UserRegistrationDto) {
    const user = await this.createUser(payload, {
      strategy: UserLoginStrategy.LOCAL,
      adminCreated: false,
    });

    const confirmationCode = await this.userService.generateOtpCode(user);

    const tokenInfo = await this.generateUserSession(user);

    return {
      token: tokenInfo,
      user: user,
    };
  }

  async createUser(
    payload: UserRegistrationDto,
    options: { strategy: UserLoginStrategy; adminCreated: boolean },
    roleNames = [RoleNameEnum.Student],
  ): Promise<IUser> {
    const { email } = payload;
    const { strategy, adminCreated } = options;

    const emailExist = await this.userModel.findOne(
      { email },
      {
        getDeleted: true,
      },
    );

    if (emailExist) {
      ErrorHelper.BadRequestException(EMAIL_ALREADY_EXISTS);
    }

    if (payload.username) {
      const usernameExist = await this.userModel.findOne(
        { username: payload.username },
        {
          getDeleted: true,
        },
      );

      if (usernameExist) {
        ErrorHelper.BadRequestException('Username already exists');
      }
    }

    const user = await this.userModel.create({
      email: payload.email.toLowerCase(),
      password: await this.encryptHelper.hash(payload.password),
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      phoneNumber: payload.phoneNumber,
      strategy,
      hasChangedPassword: !adminCreated && strategy === UserLoginStrategy.LOCAL,
      emailConfirm: strategy !== UserLoginStrategy.LOCAL || adminCreated,
      country: payload?.countryId,
      adminCreated,
    });

    return user.serialize();
  }

  private async generateUserSession(user: IUser, rememberMe = true) {
    const tokenInfo = this.tokenHelper.generate(user);

    await this.userSessionService.create(user, {
      sessionId: tokenInfo.sessionId,
      rememberMe,
    });

    return tokenInfo;
  }

  async login(
    params: LoginDto,
    portalType: PortalType,
  ): Promise<{
    token: object;
    user: IUser;
  }> {
    const { email, password } = params;

    const user = await this.validateUser(email, password, portalType);

    const tokenInfo = await this.generateUserSession(user, params.rememberMe);

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        lastSeen: new Date(),
      },
    );

    return {
      token: tokenInfo,
      user,
    };
  }

  async validateUser(
    email: string,
    password: string,
    portalType: PortalType,
  ): Promise<IUser> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      ErrorHelper.BadRequestException(INVALID_EMAIL_OR_PASSWORD);
    }

    const passwordMatch = await this.encryptHelper.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      ErrorHelper.BadRequestException(INVALID_EMAIL_OR_PASSWORD);
    }

    return user.serialize();
  }
}
