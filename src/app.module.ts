import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './modules/category/category.module';
dotenv.config()

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
