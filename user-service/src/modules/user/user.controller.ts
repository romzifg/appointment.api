import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { EditUserDto } from './dto/edit-input.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req) {
        return this.userService.getProfile(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Request() req, @Body() input: EditUserDto) {
        return this.userService.updateUser(req.user.id, input);
    }

    @Delete('profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteProfile(@Request() req) {
        return this.userService.deleteUser(req.user.id);
    }
}