import { Exclude } from 'class-transformer';
import { User } from '@prisma/client'; // Import the Prisma type

export class UserEntity implements User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;

    @Exclude() // THIS is the magic decorator!
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
