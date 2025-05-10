import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, IsBoolean, IsArray } from 'class-validator';

export class CreateCategoryInput {
    @IsNotEmpty()
    @IsString()
    name: string;
}


export class GetAllCategory {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsNumber()
    skip: number;

    @IsOptional()
    @IsNumber()
    limit: number;
}


