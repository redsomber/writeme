import * as mongoose from 'mongoose'
import env from '@/helpers/env'

export default function runMongo(mongoUrl = env.MONGO) {
  mongoose.set('strictQuery', false)
  return mongoose.connect(mongoUrl)
}
