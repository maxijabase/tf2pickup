import { database } from './database'
import { PlayerModel } from './models/player.model'
import { QueueSlotModel } from './models/queue-slot.model'
import { QueueStateModel } from './models/queue-state.model'

export const collections = {
  players: database.collection<PlayerModel>('players'),
  queueSlots: database.collection<QueueSlotModel>('queue.slots'),
  queueState: database.collection<QueueStateModel>('queue.state'),
}
