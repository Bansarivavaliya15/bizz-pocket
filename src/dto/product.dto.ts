
import { IsString, IsOptional, IsNumber, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    price: number;

    @IsNotEmpty()
    categoryId: ObjectId;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    price?: number;

    @IsOptional()
    categoryId?: ObjectId;
}
