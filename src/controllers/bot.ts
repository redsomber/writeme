import { MenuRange } from '@grammyjs/menu'
import { MyContext, MyConversation } from '@/helpers/botLoad'
import { Rating } from '@/helpers/interfaces'
import { addMenu, editMenu } from '@/menus/menus'
import { messageModel } from '@/models/Message'
import { storageRAM } from '@/helpers/session'

const ratingDB: Rating[] = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
]

export async function addPost(conversation: MyConversation, ctx: MyContext) {
  try {
    await ctx.reply('Write me your idea!')
    const { message } = await conversation.waitFor(':text')

    if (!message?.text || !message?.from?.username) {
      return console.log('Empty message')
    }

    storageRAM.readAll()[0].text = message.text
    storageRAM.readAll()[0].userID = message.from.username
    await ctx.reply(`Your post is "${message.text}"`, {
      reply_markup: addMenu,
    })
  } catch (error) {
    console.error(error)
  }
}

export async function showTop3(ctx: MyContext) {
  try {
    if (!ctx.message?.from?.username) {
      return console.log('Empty user')
    }

    const db = await messageModel
      .find({ userID: ctx.message?.from.username })
      .sort({ score: -1 })
      .limit(3)

    for (let i = 0; i < db.length; i++) {
      const text = `Idea: 
      Text: ${db[i].text}
      Need: ${db[i].need}
      Entry: ${db[i].entry}
      Control: ${db[i].scale}
      Score: ${db[i].control}
      Time: ${db[i].time}
      Score: ${db[i].score} 
      `
      await ctx.reply(text)
    }
  } catch (error) {
    console.error(error)
  }
}

export async function editPost(ctx: MyContext) {
  try {
    if (!ctx.message?.from?.username) {
      return console.log('Empty user')
    }

    const db = await messageModel
      .find({ userID: ctx.message.from.username })
      .sort({ score: -1 })
    for (let i = 0; i < db.length; i++) {
      const text = `${db[i].text}\nScore: ${db[i].score}`
      await ctx.reply(text, {
        reply_markup: editMenu,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export function createRateMenu(rate: string) {
  return new MenuRange<MyContext>()
    .submenu({ text: 'Add rating', payload: rate }, 'Need', async (ctx) => {
      await ctx.editMessageText(`Need rate for "${ctx.session.text}?"`)
    })
    .submenu({ text: 'Late', payload: rate }, 'add', async (ctx) => {
      await ctx.reply(`Only text: "${ctx.session.text}"`)
      await messageModel.create({
        userID: ctx.session.userID,
        text: ctx.session.text,
        score: 0,
      })
      await ctx.deleteMessage()
    })
}

export function createNECSTmenu(need: string, NECST: string) {
  const range = new MenuRange<MyContext>()

  for (const rate of ratingDB) {
    range.submenu({ text: rate.name, payload: rate.id }, NECST, async (ctx) => {
      if (NECST == 'End') {
        await ctx.editMessageText('Rating added')
      } else {
        await ctx.editMessageText(`${NECST} rate for "${ctx.session.text}"?`)
      }
    })
  }

  return range
}
