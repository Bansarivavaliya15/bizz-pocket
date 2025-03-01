import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, IsBoolean, IsArray } from 'class-validator';

export class CreateCategoryInput {
    @IsNotEmpty()
    @IsString()
    name: string;
}

