import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@app/common';
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prisma: PrismaHealthIndicator,
        private prismaService: PrismaService, // Inject your Prisma service
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            // This tells Terminus to ping the database
            () => this.prisma.pingCheck('database', this.prismaService),
        ]);
    }
    
}
