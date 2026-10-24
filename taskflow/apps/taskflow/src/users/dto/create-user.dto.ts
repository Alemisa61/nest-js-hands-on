import{IsEmail,IsEnum,IsNotEmpty,IsString,MinLength} from 'class-validator'
export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsEnum(['admin', 'member'])
    role: 'admin' | 'member';
    @IsString()
    @IsNotEmpty()
    name: String;
    @IsString()
    @MinLength(6)
    Password: string
}