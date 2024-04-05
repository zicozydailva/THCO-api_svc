import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { RequestHeadersEnum } from 'src/interfaces/http';
import { RoleNameEnum } from 'src/interfaces/roles.interfaces';
import { IUser } from 'src/interfaces/user.interfaces';
import { UserSessionService } from 'src/modules/user-session/service';
import { TokenHelper } from 'src/modules/utils/token.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private tokenHelper: TokenHelper,
    private userSession: UserSessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization =
      req.headers[RequestHeadersEnum.Authorization] ||
      String(req.cookies.accessToken);
    const business =
      req.headers[RequestHeadersEnum.BusinessId] ||
      String(req.cookies.businessId);

    const businessRole = [RoleNameEnum.CorpAdmin, RoleNameEnum.CorpStudent];

    if (!authorization) {
      ErrorHelper.ForbiddenException('Authorization header is required');
    }

    const user = await this.verifyAccessToken(authorization);

    req.user = user;

    return true;
  }

  async verifyAccessToken(authorization: string): Promise<IUser> {
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer == 'Bearer' && accessToken !== '') {
      const user = this.tokenHelper.verify<IUser & { sessionId: string }>(
        accessToken,
      );

      const session = await this.userSession.get(user._id);

      if (!session) {
        this.logger.error(`verifyAccessToken: Session not found ${user._id}`);
        ErrorHelper.UnauthorizedException('Unauthorized!');
      }

      if (session.sessionId !== user.sessionId) {
        this.logger.error(
          `verifyAccessToken: SessionId not match ${session.sessionId} - ${user.sessionId}`,
        );
        ErrorHelper.UnauthorizedException('Unauthorized');
      }

      return user;
    } else {
      this.logger.error(`verifyAccessToken: Invalid token ${accessToken}`);
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
  }
}
