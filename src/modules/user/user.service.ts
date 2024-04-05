import { Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/interfaces/user.interfaces';
import { TokenHelper } from '../utils/token.utils';
import { Token } from './token.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { ErrorHelper } from 'src/helpers/error.utils';
import { DateHelper } from '../utils/date.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Token.name) private tokenRepo: Model<Token>,
    private tokenHelper: TokenHelper,
    private encryptHelper: EncryptHelper,
  ) {}
  private logger = new Logger(UserService.name);

  async generateOtpCode(
    user: IUser,
    options = {
      numberOnly: true,
      length: 6,
    },
    expirationTimeInMinutes = 10,
  ): Promise<string> {
    let code = '';

    if (options.numberOnly) {
      code = this.tokenHelper.generateRandomNumber(options.length);
    } else {
      code = this.tokenHelper.generateRandomString(options.length);
    }

    await this.tokenRepo.remove({ user: user._id, isUsed: false });

    await this.tokenRepo.create({
      user: user._id,
      code,
      expirationTime: DateHelper.addToCurrent({
        minutes: expirationTimeInMinutes,
      }),
    });

    return code;
  }

  async verifyOtpCode(
    user: IUser,
    code: string,
    message?: string,
  ): Promise<boolean> {
    const otp = await this.tokenRepo.findOne({
      user: user._id,
      code,
      isUsed: false,
    });

    if (!otp) {
      ErrorHelper.BadRequestException('Invalid code');
    }

    if (DateHelper.isAfter(new Date(), otp.expirationTime)) {
      ErrorHelper.BadRequestException(
        message ||
          "This code has expired. You can't change your password using this link",
      );
    }

    await otp.deleteOne();

    return true;
  }
}
