import { Body, Controller, Post, Delete, Param, Patch, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':uid')
  getUser(@Param('uid') uid: string) {
    return this.authService.getUserById(uid);
  }

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Patch('update')
  updateUser(@Body() dto: UpdateUserDto) {
    return this.authService.updateUser(dto);
  }

  @Patch('updatePassword')
  updateUserPassword(@Body() dto: UpdateUserDto) {
    return this.authService.updateUserPassword(dto);
  }

  @Delete('/delete/:uid')
  delete(@Param('uid') uid: string) {
    return this.authService.deleteUser(uid);
  }
}
