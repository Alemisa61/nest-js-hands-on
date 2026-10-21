export class CreateUserDto {
    email: string;
    role: 'admin' | 'member';
}