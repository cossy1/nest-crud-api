import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User){    
        return user
    } 

    @UseGuards(JwtGuard)
    @Get()
    getAllUser(){    
        return this.userService.getAllUser()
    } 

    @Patch(':id')
    editUser(@Body() dto: EditUserDto, @Param('id', ParseIntPipe) currentUserId: number){
        return this.userService.editUser(currentUserId, dto)
    }
}
