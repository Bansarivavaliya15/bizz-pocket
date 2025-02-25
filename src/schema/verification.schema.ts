import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";
import { BaseSchema } from "./base.schema";

@Schema({ timestamps: true })
export class Verification extends BaseSchema {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ required: true })
    otp: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);