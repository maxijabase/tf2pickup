import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const environmentSchema = z.object({
  NODE_ENV: z.string().default('development'),

  MONGODB_URI: z.string().url(),
  STEAM_API_KEY: z.string(),
  QUEUE_CONFIG: z.enum(['test', '6v6', '9v9', 'bball', 'ultiduo']).default('6v6'),
})

export const environment = environmentSchema.parse(process.env)
