import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, IsBoolean, IsArray } from 'class-validator';
import { ObjectId } from 'mongoose';

export class LoginUserInput {
    @IsNotEmpty()
    @IsString()
    mobileNo: string;

    @IsOptional()
    areaCode: string;

    @IsOptional()
    signature: string;
}


export class VerifyUserInput {
    @IsNotEmpty()
    id: ObjectId;

    @IsNotEmpty()
    otp: number;
}


export class ResendOtpInput extends LoginUserInput {
    @IsNotEmpty()
    id: ObjectId;
}