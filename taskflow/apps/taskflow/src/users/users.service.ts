import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'A user with this email already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    this.eventEmitter.emit('user.created', {
      userId: user.id,
      email: user.email,
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }
  // <--- Notice that the create() method STOPS here!

  // Now, add the listener as its own separate method:
  @OnEvent('user.created')
  handleUserCreatedEvent(payload: { userId: string; email: string }) {
    // Make sure it is lowercase 'logger'
    this.logger.log(`🎉 Event Received! A new user joined: ${payload.email}`);
    console.log('Event Payload details:', payload);
  }

  async findAll(filterdto: GetUsersFilterDto) {
    const { role } = filterdto;
    const page = filterdto.page ?? 1;
    const limit = filterdto.limit ?? 10;
    const skip = (page - 1) * limit;

    return this.prisma.user.findMany({
      where: {
        role: role || undefined,
      },
      skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
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
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `User with id ${id} does not exist.`,
        );
      }

      throw error;
    }
  }
}