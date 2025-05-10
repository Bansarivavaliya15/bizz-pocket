import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Category } from 'src/entites/category.entity';
import { Product } from 'src/entites/product.entity';
import { User } from 'src/entites/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Product])],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule { }
