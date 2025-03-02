import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from 'src/dto/category.dto';
import { Category } from 'src/schema/category.schema';
import { AuthGuard } from 'src/common/guards/auth.gurad';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post('create')
  async create(@Request() request, @Body() createCategoryInput: CreateCategoryInput) {
    try {
      return await this.categoryService.create(request.user, createCategoryInput);
    } catch (error) {
      console.log('create-category-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@Request() request): Promise<Category[]> {
    try {
      return this.categoryService.findAll(request.user);
    } catch (error) {
      console.log('findAll-category-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      return this.categoryService.findOne(id);
    } catch (error) {
      console.log('findOne-category-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: Partial<CreateCategoryInput>): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      console.log('update-category-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      console.log('delete-category-error=======>:', error);
      throw new BadRequestException(error.message);
    }
  }
}
