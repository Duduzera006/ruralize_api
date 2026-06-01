import { Body, Controller, Post, Delete, Param, Patch, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('stores')
  @ApiOperation({ summary: 'Listar todas as lojas (empresas) cadastradas' })
  getStores() {
    return this.authService.getPublicStores();
  }

  @Get(':uid')
  @ApiOperation({ summary: 'Obter dados de um usuário pelo UID' })
  getUser(@Param('uid') uid: string) {
    return this.authService.getUserById(uid);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Registrar uma nova empresa' })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Atualizar dados cadastrais da empresa' })
  updateUser(@Body() dto: UpdateUserDto) {
    return this.authService.updateUser(dto);
  }

  @Patch('updatePassword')
  @ApiOperation({ summary: 'Atualizar apenas a senha da empresa' })
  updateUserPassword(@Body() dto: UpdateUserDto) {
    return this.authService.updateUserPassword(dto);
  }

  @Patch('fcm-token')
  @ApiOperation({ summary: 'Atualizar o token FCM para notificações push' })
  updateFcmToken(@Body() dto: { uid: string; token: string }) {
    return this.authService.updateFcmToken(dto.uid, dto.token);
  }

  @Delete('/delete/:uid')
  @ApiOperation({ summary: 'Remover conta da empresa' })
  delete(@Param('uid') uid: string) {
    return this.authService.deleteUser(uid);
  }
}
