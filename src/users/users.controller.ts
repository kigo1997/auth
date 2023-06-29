import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Request() req, @Param('id') id: number, @Body() user: User) {
    if (req.userId != id && !req.admin) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return this.usersService.update(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    if (req.userId != id && !req.admin) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return this.usersService.remove(id);
  }
}
