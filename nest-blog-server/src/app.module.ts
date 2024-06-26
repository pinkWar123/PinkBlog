import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { UploadModule } from '@modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TagsModule } from '@modules/tags/tags.module';
import { PostsModule } from '@modules/posts/posts.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { SeedingModule } from '@modules/seeding/seeding.module';
import { SeriesModule } from './series/series.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      ttl: 30 * 1000,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          ttl: 30 * 1000,
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
        });
        return { store };
      },
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    UploadModule,
    TagsModule,
    PostsModule,
    CommentsModule,
    PermissionsModule,
    RolesModule,
    SeedingModule,
    SeriesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
