import { collections } from '../database/collections'
import { tasks, type TaskArgs, type Tasks } from './tasks'

export async function cancel<T extends keyof Tasks>(name: T, ...args: Partial<TaskArgs[T]>[]) {
  if (!tasks[name]) {
    throw new Error(`task not registered: ${name}`)
  }

  await collections.tasks.deleteMany({ name, args: args[0] ?? {} })
}
