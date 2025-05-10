import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Category } from 'src/entites/category.entity';
import { Product } from 'src/entites/product.entity';
import { User } from 'src/entites/user.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    uploadDocument(req, files): string[] {
        const baseURL = process.env.BASE_URL || req.protocol + '://' + req.get('host');
        return files.map((file) => (baseURL + '/' + file.filename));
    }

    async create(req, files, createProductDto: CreateProductDto): Promise<Product> {
        const [existingProduct, category] = await Promise.all([
            this.productRepository.findOne({ where: { name: createProductDto.name, isDeleted: false } }),
            this.categoryRepository.findOne({ where: { id: createProductDto.categoryId, isDeleted: false } }),
        ]);

        if (existingProduct) throw new BadRequestException('Product with this name already exists');
        if (!category) throw new NotFoundException('Category not found with this category id');

        const product = this.productRepository.create({
            name: createProductDto.name,
            price: Number(createProductDto.price),
            category,
            user: req.user,
            attachments: files ? this.uploadDocument(req, files) : [],
        });

        return this.productRepository.save(product);
    }

    async findAll(user: User): Promise<Product[]> {
        return this.productRepository.find({
            where: { isDeleted: false, user: { id: user.id } },
            relations: ['category', 'user'],
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['category', 'user'],
        });

        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(req, files, id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const existingProduct = await this.productRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['category'],
        });

        if (!existingProduct) throw new NotFoundException('Product not found');

        const category = await this.categoryRepository.findOne({
            where: { id: updateProductDto.categoryId ?? existingProduct.category.id, isDeleted: false },
        });

        const updateFields: Partial<Product> = {
            name: updateProductDto.name ?? existingProduct.name,
            description: updateProductDto.description ?? existingProduct.description,
            price: Number(updateProductDto.price) ?? Number(existingProduct.price),
            category,
            attachments: files ? this.uploadDocument(req, files) : existingProduct.attachments,
        };

        return this.productRepository.save({ ...existingProduct, ...updateFields });
    }

    async delete(id: string): Promise<{ message: string }> {
        const existingProduct = await this.productRepository.findOne({
            where: { id, isDeleted: false },
        });

        if (!existingProduct) throw new NotFoundException('Product not found');

        existingProduct.isDeleted = true;
        await this.productRepository.save(existingProduct);

        return { message: 'Product deleted successfully' };
    }
}
