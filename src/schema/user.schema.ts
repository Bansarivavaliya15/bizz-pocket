import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { AccountType, Language, Role } from "enum";
import { BaseSchema } from "./base.schema";

@Schema({ timestamps: true })
export class User extends BaseSchema {

    @Prop({ required: true })
    mobileNo: string;

    @Prop()
    email: string;

    @Prop()
    profile: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({
        type: String,
        enum: Object.values(Language),
        default: Language.ENGLISH
    })
    language: string;

    @Prop({
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.SMALL_SHOP
    })
    type: string;

    @Prop()
    userName: string;

    @Prop()
    name: string;

    @Prop()
    tableSize: string;

    @Prop()
    deviceToken: string;

    @Prop({
        type: String,
        enum: Object.values(Role),
        default: Role.ADMIN
    })
    role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);