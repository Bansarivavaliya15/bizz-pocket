import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryInput } from 'src/dto/category.dto';
import { Category } from 'src/schema/category.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    ) { }


    async create(user: User, createCategoryInput: CreateCategoryInput): Promise<Category> {
        const existingCategory = await this.categoryModel.findOne({ name: createCategoryInput.name });
        if (existingCategory) throw new Error('Category with this name already exists');

        const category = new this.categoryModel();
        category.name = createCategoryInput.name
        category.user = user
        return category.save();
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find({ isDeleted: false }).populate('user');
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).populate('user');
        if (!category) throw new Error('Category not found');

        return category;
    }

    async update(id: string, updateCategoryDto: Partial<CreateCategoryInput>): Promise<Category> {
        const existingCategory = await this.categoryModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (!existingCategory) throw new Error('Category not exists');

        return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    }

    async delete(id: string): Promise<{ message: string }> {
        const existingCategory = await this.categoryModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (!existingCategory) throw new Error('Category not exists');

        await this.categoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        return { message: "Category Delete successfully" };
    }
}
