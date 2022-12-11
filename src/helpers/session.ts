import { MemorySessionStorage, session } from 'grammy'
import { SessionData } from '@/helpers/interfaces'

export const storageRAM = new MemorySessionStorage<SessionData>()

export default session({
  initial(): SessionData {
    return {
      userID: '',
      text: '',
      need: 0,
      entry: 0,
      control: 0,
      scale: 0,
      time: 0,
      score: 0,
    }
  },
  storage: storageRAM,
})
