import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    surname: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        default: 0
    })
    credit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
