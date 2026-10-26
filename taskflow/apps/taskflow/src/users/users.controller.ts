import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserEntity } from './entities/user.entity';
import { Query } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';;
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post('upload')
  // 1. Remove the { dest: './uploads' } object! This forces Multer to keep the file in memory.
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
      ],
    }),
  ) file: Express.Multer.File) {

    // 2. Create the uploads folder manually if it doesn't exist
    const uploadFolder = './uploads';
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }

    // 3. Write the secure, validated memory buffer to the disk
    const filePath = `${uploadFolder}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);

    return {
      message: 'File uploaded and validated securely!',
      filename: file.originalname,
      size: file.size,
    };
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // 1. Await the database result
    const user = await this.usersService.create(createUserDto);
    // 2. Wrap it in the class
    return new UserEntity(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() filterdto:GetUsersFilterDto) {
    const users = await this.usersService.findAll(filterdto);
    // For arrays, we have to map over them to wrap each individual user
    return users.map(user => new UserEntity(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    // Wrap the single user
    return new UserEntity(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return new UserEntity(user);
  }
}
