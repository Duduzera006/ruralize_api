import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova entrega' })
  @ApiResponse({ status: 201, description: 'Entrega criada com sucesso.' })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get(':empresaId')
  @ApiOperation({ summary: 'Listar todas as entregas de uma empresa' })
  findAll(@Param('empresaId') empresaId: string) {
    return this.deliveriesService.findAll(empresaId);
  }

  @Get(':empresaId/:id')
  @ApiOperation({ summary: 'Obter detalhes de uma entrega específica' })
  findOne(@Param('empresaId') empresaId: string, @Param('id') id: string) {
    return this.deliveriesService.findOne(empresaId, id);
  }

  @Patch(':empresaId/:id')
  @ApiOperation({ summary: 'Atualizar dados de uma entrega' })
  update(
    @Param('empresaId') empresaId: string,
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveriesService.update(empresaId, id, updateDeliveryDto);
  }

  @Delete(':empresaId/:id')
  @ApiOperation({ summary: 'Remover uma entrega' })
  remove(@Param('empresaId') empresaId: string, @Param('id') id: string) {
    return this.deliveriesService.remove(empresaId, id);
  }
}
