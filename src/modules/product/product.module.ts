import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schema/category.schema';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Category.name, schema: CategorySchema },
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema: ProductSchema }
  ])],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule { }
