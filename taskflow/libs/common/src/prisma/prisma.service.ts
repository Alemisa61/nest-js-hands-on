import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // 1. Read the URL from your .env file
        const connectionString = process.env.DATABASE_URL;

        // 2. Create a connection pool using the native 'pg' driver
        const pool = new Pool({ connectionString });

        // 3. Wrap it in Prisma's adapter
        const adapter = new PrismaPg(pool);

        // 4. Pass the adapter to the Prisma Client
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}