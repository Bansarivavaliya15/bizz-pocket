import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.schema";
import { BaseSchema } from "./base.schema";

@Schema({ timestamps: true })
export class Category extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);