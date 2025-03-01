import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Category } from 'src/schema/category.schema';
import { Product } from 'src/schema/product.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>
    ) { }


    uploadDocument(req, files): string[] {
        const baseURL = process.env.BASE_URL || req.protocol + '://' + req.get('host');
        return files.map((file) => (baseURL + '/' + file.filename));
    }

    async create(req, files, createProductDto: CreateProductDto): Promise<Product> {
        const [existingProduct, category] = await Promise.all([
            this.productModel.findOne({ name: createProductDto.name }),
            this.categoryModel.findOne({ _id: createProductDto.categoryId })
        ]);
        if (existingProduct) throw new Error('Product with this name already exists');
        if (!category) throw new Error('Category not found with this category id.');

        const product = new this.productModel();
        if (files) {
            product.attachments = this.uploadDocument(req, files)
        }
        product.category = category;
        product.price = Number(createProductDto.price);
        product.name = createProductDto.name;
        product.user = req.user;
        return product.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().populate('category').populate('user');
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate('category').populate('user');
        if (!product) throw new Error('Product not found');

        return product;
    }

    async update(req, files, id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const existingProduct = await this.productModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('category');

        if (!existingProduct) throw new Error('Product not found');
        const category = await this.categoryModel.findOne({ _id: updateProductDto.categoryId ?? existingProduct.category._id, isDeleted: false })

        const updateFields: Partial<Product> = {};
        updateFields.name = updateProductDto.name ?? existingProduct.name;
        updateFields.description = updateProductDto.description ?? existingProduct.description;
        updateFields.price = Number(updateProductDto.price) ?? Number(existingProduct.price);
        updateFields.category = category;

        if (files) {
            updateFields.attachments = this.uploadDocument(req, files);
        }

        return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    }

    async delete(id: string): Promise<{ message: string }> {
        const existingProduct = await this.productModel.findOne({
            _id: id,
            isDeleted: false
        });
        if (!existingProduct) throw new Error('Product not found');

        await this.productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        return { message: 'Product deleted successfully' };
    }
}
