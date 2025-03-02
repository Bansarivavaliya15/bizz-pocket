import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, Request, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.gurad';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Product } from 'src/schema/product.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('/create')
  @UseInterceptors(FilesInterceptor('attachments', 20, multerOptions))
  async create(@Request() req: Request, @UploadedFiles() files, @Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(req, files, createProductDto);
    } catch (error) {
      console.log('create-product-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@Request() req): Promise<Product[]> {
    try {
      return await this.productService.findAll(req.user);
    } catch (error) {
      console.log('product-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      console.log('product-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('attachments', 20, multerOptions))
  async update(@Request() req: Request, @UploadedFiles() files, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      return await this.productService.update(req, files, id, updateProductDto);
    } catch (error) {
      console.log('update- product-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      console.log('delete-product-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }
}