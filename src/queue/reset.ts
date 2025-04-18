import { collections } from '../database/collections'
import type { QueueSlotModel } from '../database/models/queue-slot.model'
import { QueueState } from '../database/models/queue-state.model'
import { events } from '../events'
import { logger } from '../logger'
import { Tf2ClassName } from '../shared/types/tf2-class-name'
import { config } from './config'
import { getSlots } from './get-slots'
import { getState } from './get-state'
import { resetMapOptions } from './reset-map-options'

export async function reset() {
  logger.trace('queue.reset()')
  const slots = generateEmptyQueue()
  await collections.queueSlots.deleteMany({})
  await collections.queueSlots.insertMany(slots)
  await collections.queueState.updateOne(
    {},
    {
      $set: {
        state: QueueState.waiting,
      },
    },
    {
      upsert: true,
    },
  )
  events.emit('queue/slots:updated', { slots: await getSlots() })
  events.emit('queue/state:updated', { state: await getState() })
  await resetMapOptions()
  logger.info('queue reset')
}

type EmptyQueueSlot = Omit<QueueSlotModel, 'player'> & { player: null }

function generateEmptyQueue(): EmptyQueueSlot[] {
  const classCounts = Object.fromEntries(Object.keys(Tf2ClassName).map(gc => [gc, 1])) as Record<
    Tf2ClassName,
    number
  >

  const slots = config.classes.reduce<EmptyQueueSlot[]>((prev, curr) => {
    const classSlots: EmptyQueueSlot[] = []
    for (let i = 0; i < curr.count * config.teamCount; ++i) {
      classSlots.push({
        id: `${curr.name}-${classCounts[curr.name]++}`,
        gameClass: curr.name,
        canMakeFriendsWith: curr.canMakeFriendsWith ?? [],
        player: null,
        ready: false,
      })
    }

    return prev.concat(classSlots)
  }, [])

  return slots
}
