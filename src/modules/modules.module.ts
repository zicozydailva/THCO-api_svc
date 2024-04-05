import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthenticationModule, PostsModule, NotificationsModule, UserModule]
})
export class AppModule {}
