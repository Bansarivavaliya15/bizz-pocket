import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from 'src/dto/category.dto';
import { Category } from 'src/entites/category.entity';
import { User } from 'src/entites/user.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(user: User, createCategoryInput: CreateCategoryInput): Promise<Category> {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name: createCategoryInput.name, isDeleted: false },
        });

        if (existingCategory) {
            throw new BadRequestException('Category with this name already exists');
        }

        const category = this.categoryRepository.create({
            name: createCategoryInput.name,
            user,
        });

        return this.categoryRepository.save(category);
    }

    async findAll(user: User): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { isDeleted: false, user: { id: user.id } },
            relations: ['user'],
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['user'],
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(id: string, updateCategoryDto: Partial<CreateCategoryInput>): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id, isDeleted: false },
        });

        if (!category) {
            throw new NotFoundException('Category does not exist');
        }

        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async delete(id: string): Promise<{ message: string }> {
        const category = await this.categoryRepository.findOne({
            where: { id, isDeleted: false },
        });

        if (!category) {
            throw new NotFoundException('Category does not exist');
        }

        category.isDeleted = true;
        await this.categoryRepository.save(category);

        return { message: 'Category deleted successfully' };
    }
}
