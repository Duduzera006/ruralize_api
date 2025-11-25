import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('/empresa/:empresaId')
  findAll(@Param('empresaId') empresaId: string) {
    return this.ordersService.findAll(empresaId);
  }

  @Get('/totalVendas/:empresaId')
  getTotalSales(@Param('empresaId') empresaId: string) {
    return this.ordersService.getTotalSales(empresaId);
  }

  @Get(':empresaId/:orderId')
  findOne(@Param('empresaId') empresaId: string, @Param('orderId') orderId: string) {
    return this.ordersService.findOne(empresaId, orderId);
  }

  @Patch(':empresaId/:orderId')
  update(
    @Param('empresaId') empresaId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(empresaId, orderId, dto);
  }

  @Delete(':empresaId/:orderId')
  remove(@Param('empresaId') empresaId: string, @Param('orderId') orderId: string) {
    return this.ordersService.remove(empresaId, orderId);
  }
}
