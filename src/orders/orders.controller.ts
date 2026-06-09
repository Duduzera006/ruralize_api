import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um pedido (Checkout)' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos do sistema (Admin)' })
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('/comprador/:compradorId')
  @ApiOperation({ summary: 'Listar histórico de pedidos de um comprador' })
  findByBuyer(@Param('compradorId') compradorId: string) {
    return this.ordersService.findByBuyer(compradorId);
  }

  @Get('/empresa/:empresaId')
  @ApiOperation({ summary: 'Listar pedidos recebidos por uma empresa' })
  findAll(@Param('empresaId') empresaId: string) {
    return this.ordersService.findAll(empresaId);
  }

  @Get('/totalVendas/:empresaId')
  @ApiOperation({ summary: 'Obter resumo de vendas de uma empresa' })
  getTotalSales(@Param('empresaId') empresaId: string) {
    return this.ordersService.getTotalSales(empresaId);
  }

  @Get(':empresaId/:orderId')
  @ApiOperation({ summary: 'Obter detalhes de um pedido específico' })
  findOne(@Param('empresaId') empresaId: string, @Param('orderId') orderId: string) {
    return this.ordersService.findOne(empresaId, orderId);
  }

  @Patch(':empresaId/:orderId')
  @ApiOperation({ summary: 'Atualizar status de um pedido' })
  update(
    @Param('empresaId') empresaId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(empresaId, orderId, dto);
  }

  @Delete(':empresaId/:orderId')
  @ApiOperation({ summary: 'Remover um pedido' })
  remove(@Param('empresaId') empresaId: string, @Param('orderId') orderId: string) {
    return this.ordersService.remove(empresaId, orderId);
  }
}
