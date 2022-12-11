import { Bot, Context, SessionFlavor } from 'grammy'
import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { SessionData } from '@/helpers/interfaces'

const bot = new Bot<MyContext>('5859175137:AAFXwAtKjX_BsCe_JXTIKQ6y4GV2_olI72w')

export type MyContext = SessionFlavor<SessionData> &
  Context &
  ConversationFlavor

export type MyConversation = Conversation<MyContext>

export default bot
