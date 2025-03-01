import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject, IsBoolean, IsArray } from 'class-validator';
import { AccountType, Language } from 'enum';
import { ObjectId } from 'mongoose';

export class LoginUserInput {
    @IsNotEmpty()
    @IsString()
    mobileNo: string;

    @IsOptional()
    areaCode: string;

    @IsOptional()
    signature: string;

    @IsNotEmpty()
    deviceToken: string;
}


export class VerifyUserInput {
    @IsNotEmpty()
    id: ObjectId;

    @IsNotEmpty()
    otp: number;

    @IsNotEmpty()
    deviceToken: string;
}


export class ResendOtpInput extends LoginUserInput {
    @IsNotEmpty()
    id: ObjectId;

    @IsNotEmpty()
    deviceToken: string;
}


export class UpdateUser {

    @IsOptional()
    email: string;

    @IsOptional()
    language: Language;

    @IsOptional()
    type: AccountType;


    @IsOptional()
    userName: AccountType;

    @IsOptional()
    name: string;


    @IsOptional()
    tableSize: string;
}