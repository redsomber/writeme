import { FileAdapter } from '@grammyjs/storage-file'
import { SessionData } from '@/helpers/interfaces'
import { session } from 'grammy'

const storage = new FileAdapter<SessionData>({
  dirName: 'sessions',
})

export default session({
  initial(): SessionData {
    return {
      userID: 0,
      text: '',
      need: 0,
      entry: 0,
      control: 0,
      scale: 0,
      time: 0,
      score: 0,
    }
  },
  storage: storage,
})
