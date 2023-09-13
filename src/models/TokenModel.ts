import { prop, getModelForClass } from "@typegoose/typegoose";

class Token {
  @prop({ required: true })
  public userId: string;

  @prop({ required: true })
  public token: string;

  @prop({ default: Date.now(), expires: 60 * 10 })
  public createdAt: Date;
}

export const TokenModel = getModelForClass(Token);
