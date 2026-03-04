import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).default('Money Manager'),
    VITE_APP_URL: z.string().url().optional(),
  },

  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
})
