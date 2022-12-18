import { Bot, Context, SessionFlavor } from 'grammy'
import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { SessionData } from '@/helpers/interfaces'
import env from '@/helpers/env'

const bot = new Bot<MyContext>(env.BOT_TOKEN)

export type MyContext = SessionFlavor<SessionData> &
  Context &
  ConversationFlavor

export type MyConversation = Conversation<MyContext>

export default bot
