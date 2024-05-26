import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Series, SeriesSchema } from './schemas/series.schema';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Series.name,
        schema: SeriesSchema,
      },
    ]),
    PostsModule,
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
