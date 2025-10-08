import { Body, Controller, Post, Delete, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Patch('update')
  updateUser(@Body() dto: UpdateUserDto) {
    return this.authService.updateUser(dto);
  }

  @Delete('/delete/:uid')
  delete(@Param('uid') uid: string) {
    return this.authService.deleteUser(uid);
  }
}
