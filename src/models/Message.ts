import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ required: true, index: true })
  userID!: string
  @prop({ required: true })
  text!: string
  @prop()
  need?: number
  @prop()
  entry?: number
  @prop()
  control?: number
  @prop()
  scale?: number
  @prop()
  time?: number
  @prop()
  score?: number
}
export const messageModel = getModelForClass(Message)
