import 'module-alias/register'
import 'source-map-support/register'

import {
  addMenu,
  controlMenu,
  editMenu,
  endRate,
  entryMenu,
  needMenu,
  rateMenu,
  scaleMenu,
  timeMenu,
} from '@/menus/menus'
import { addPost, editPost, showTop3 } from '@/controllers/bot'
import { conversations, createConversation } from '@grammyjs/conversations'
import { run } from '@grammyjs/runner'
import bot from '@/helpers/botLoad'
import customSession from '@/helpers/session'
import runMongo from '@/helpers/mongo'

async function runApp() {
  console.log('Starting mongo')
  await runMongo()

  bot.use(customSession)
  bot.use(conversations())
  bot.use(addMenu)
  bot.use(editMenu)

  addMenu.register(rateMenu)
  editMenu.register(rateMenu)
  rateMenu.register(needMenu)
  needMenu.register(entryMenu)
  entryMenu.register(controlMenu)
  controlMenu.register(scaleMenu)
  scaleMenu.register(timeMenu)
  timeMenu.register(endRate)

  bot.use(createConversation(addPost))

  bot.command('top3', showTop3)
  bot.command('add', async (ctx) => {
    await ctx.conversation.enter('addPost')
  })
  bot.command('all', editPost)

  bot.catch(console.error.bind(console))

  await bot.init()
  run(bot, Infinity)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}
void runApp()
