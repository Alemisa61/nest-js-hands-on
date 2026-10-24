import 'dotenv/config'; // <-- THIS LINE IS NEW! It loads your .env file
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
