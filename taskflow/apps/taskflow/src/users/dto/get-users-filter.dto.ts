import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersFilterDto {
    @ApiPropertyOptional({ description: 'Filter by user role' })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiPropertyOptional({ description: 'Page number (starts at 1)' })
    @IsOptional()
    @Type(() => Number) // Converts the string "1" from the URL to a Number 1
    @IsInt()
    @Min(1)
    page?: number = 1; // Default to page 1

    @ApiPropertyOptional({ description: 'Number of items per page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10; // Default to 10 items
}