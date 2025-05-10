import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateShopInput {
    @IsNotEmpty()
    @IsString()
    mobileNo: string;

    @IsNotEmpty()
    @IsString()
    shopName: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    isLoginEnable: boolean;

    @IsOptional()
    password: string;

}