import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

  // _id: string; <-- Mongo lo creará
  _id?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ minlength: 6, required: true })
  password?: string;

  // POr defecto quiero que sea true
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

}

// Porporcionar el Schema para que lo reciba la DB
export const UserSchema = SchemaFactory.createForClass( User );
