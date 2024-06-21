import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { LogsModule } from './logs/logs.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ItemsModule,
    AuthModule,
    EventsModule,
    LogsModule,
    MessagesModule,
  ],
})
export class AppModule {}
