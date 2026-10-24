
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string; // Notice the !

    @IsEnum(['admin', 'member'])
    role!: 'admin' | 'member'; // Notice the !

    @IsString()
    @IsNotEmpty()
    name!: string; // Notice the !

    @IsString()
    @MinLength(6)
    password!: string; // Notice the !
}
