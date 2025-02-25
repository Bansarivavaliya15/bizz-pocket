import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AccountType, Language } from "enum";

@Schema({ timestamps: true })
export class User extends Document {

    @Prop({ required: true })
    mobileNo: string;

    @Prop()
    email: string;

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


    @Prop({ default: false })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);