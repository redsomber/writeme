import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '@/helpers/bot'
import { createNECSTmenu, createRateMenu } from '@/controllers/bot'
import { messageModel } from '@/models/Message'

export const addMenu = new Menu<MyContext>('add')
addMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .submenu({ text: 'Add', payload: 'rate' }, 'rate', async (ctx) => {
      console.log(ctx.session)

      await ctx.editMessageText(`Add NECST rating for "${ctx.session.text}"?`)
    })
    .text('Delete', async (ctx) => {
      await ctx.deleteMessage()
    })

  return range
})

export const editMenu = new Menu<MyContext>('edit')
editMenu.dynamic(() => {
  const range = new MenuRange<MyContext>()
  range
    .submenu({ text: 'Edit rating', payload: 'rate' }, 'rate', async (ctx) => {
      const text = ctx.callbackQuery.message?.text?.split('\n')
      if (!text || !ctx.callbackQuery.from.id) {
        return console.log('not found data in "edit"')
      }
      ctx.session.text = text[0]
      ctx.session.userID = ctx.callbackQuery.from.id
      await ctx.editMessageText(`Edit NECST rating for "${ctx.session.text}"?`)
    })
    .text('Delete', async (ctx) => {
      const text = ctx.callbackQuery.message?.text?.split('\n')
      if (!text || !ctx.callbackQuery.from.id) {
        return console.log('not found data in "edit"')
      }
      ctx.session.text = text[0]
      ctx.session.userID = ctx.callbackQuery.from.id
      await messageModel.deleteOne({
        userID: ctx.session.userID,
        text: ctx.session.text,
      })

      await ctx.deleteMessage()
    })

  return range
})

export const rateMenu = new Menu<MyContext>('rate')
rateMenu.dynamic((ctx) => {
  const rate = ctx.match

  if (typeof rate !== 'string') throw new Error('No chosen!')

  return createRateMenu(rate)
})

export const needMenu = new Menu<MyContext>('Need')
needMenu.dynamic((ctx) => {
  const need = ctx.match
  if (typeof need !== 'string') throw new Error('No chosen!')

  return createNECSTmenu(need, 'Entry')
})

export const entryMenu = new Menu<MyContext>('Entry')
entryMenu.dynamic((ctx) => {
  const need = ctx.match

  if (typeof need !== 'string') throw new Error('No chosen!')
  if (ctx.update.callback_query?.data == undefined)
    throw new Error('undefinded')
  if (/Need/g.test(ctx.update.callback_query?.data) == true) {
    ctx.session.need = +need
  }

  return createNECSTmenu(need, 'Control')
})

export const controlMenu = new Menu<MyContext>('Control')
controlMenu.dynamic((ctx) => {
  const entry = ctx.match
  if (typeof entry !== 'string') throw new Error('No chosen!')
  if (ctx.update.callback_query?.data == undefined)
    throw new Error('undefinded')
  if (/Entry/g.test(ctx.update.callback_query?.data) == true) {
    ctx.session.entry = +entry
  }

  return createNECSTmenu(entry, 'Scale')
})

export const scaleMenu = new Menu<MyContext>('Scale')
scaleMenu.dynamic((ctx) => {
  const control = ctx.match
  if (typeof control !== 'string') throw new Error('No chosen!')
  if (ctx.update.callback_query?.data == undefined)
    throw new Error('undefinded')
  if (/Control/g.test(ctx.update.callback_query?.data) == true) {
    ctx.session.control = +control
  }

  return createNECSTmenu(control, 'Time')
})

export const timeMenu = new Menu<MyContext>('Time')
timeMenu.dynamic((ctx) => {
  const scale = ctx.match
  if (typeof scale !== 'string') throw new Error('No chosen!')
  if (ctx.update.callback_query?.data == undefined)
    throw new Error('undefinded')
  if (/Scale/g.test(ctx.update.callback_query?.data) == true) {
    ctx.session.scale = +scale
  }

  return createNECSTmenu(scale, 'End')
})

export const endRate = new Menu<MyContext>('End')
endRate.dynamic(async (ctx) => {
  const time = ctx.match
  if (typeof time !== 'string') throw new Error('No chosen!')
  if (ctx.update.callback_query?.data == undefined)
    throw new Error('undefinded')
  if (/Time/g.test(ctx.update.callback_query?.data) == true) {
    ctx.session.time = +time
    ctx.session.score =
      +ctx.session.need +
      +ctx.session.entry +
      +ctx.session.control +
      +ctx.session.scale +
      +ctx.session.time

    const finded = await messageModel.findOneAndUpdate(
      {
        userID: ctx.session.userID,
        text: ctx.session.text,
      },
      ctx.session
    )
    if (!finded) {
      await messageModel.create(ctx.session)
    }
  }
  const range = new MenuRange<MyContext>()
  range.submenu({ text: 'Complete', payload: time }, 'End', async (ctx) => {
    await ctx.reply(`Great! Your idea is safe!
      Text: ${ctx.session.text}
      Need: ${ctx.session.need}
      Entry: ${ctx.session.entry}
      Control: ${ctx.session.control}
      Scale: ${ctx.session.scale}
      Time: ${ctx.session.time}
      Score: ${ctx.session.score}
      `)
    await ctx.deleteMessage()
  })

  return range
})
