import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schema/category.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }, { name: User.name, schema: UserSchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
})
export class CategoryModule { }
