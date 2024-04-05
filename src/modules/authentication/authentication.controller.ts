import { Body, Controller, Post, Query } from '@nestjs/common';
import { LoginDto, PortalType, UserRegistrationDto } from './dto/auth.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Query('portalType') portalType: PortalType,
  ) {
    const data = await this.authService.login(body, portalType);

    return {
      data,
      message: 'Login successful',
    };
  }

  @Post('/signup')
  async register(@Body() body: UserRegistrationDto) {
    const data = await this.authService.signup(body);

    return {
      data,
      message: 'User created successfully',
    };
  }
}
