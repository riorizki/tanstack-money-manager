import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).default('Money Manager'),
    VITE_APP_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },

  emptyStringAsUndefined: true,
})
