import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs/internal/util/NotFoundError';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      return deletedUser;
    }
    catch (error) {
      if ((error as any).code === 'P2025') {
        throw new NotFoundException(`User with id ${id} does not exist.`);
      }
      throw error
    }
  }
    
}
