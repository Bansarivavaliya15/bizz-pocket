import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.schema";
import { BaseSchema } from "./base.schema";
import { Category } from "./category.schema";

@Schema({ timestamps: true })
export class Product extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: 0 })
    price: number;

    @Prop()
    attachments: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
    category: Category;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);