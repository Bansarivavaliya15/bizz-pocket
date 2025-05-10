
import { IsString, IsOptional, IsNumber, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

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
    categoryId: string;
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
    categoryId?: string;
}
