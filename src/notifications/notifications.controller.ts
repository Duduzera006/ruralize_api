import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma notificação manual' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get(':empresaId')
  @ApiOperation({ summary: 'Listar notificações de uma empresa' })
  findAll(@Param('empresaId') empresaId: string) {
    return this.notificationsService.findAll(empresaId);
  }

  @Patch(':empresaId/:id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markAsRead(@Param('empresaId') empresaId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(empresaId, id);
  }

  @Delete(':empresaId/:id')
  @ApiOperation({ summary: 'Remover uma notificação' })
  remove(@Param('empresaId') empresaId: string, @Param('id') id: string) {
    return this.notificationsService.remove(empresaId, id);
  }
}
