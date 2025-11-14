import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';

@Controller('products')
export class UploadController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':empresaId/:produtoId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('empresaId') empresaId: string,
    @Param('produtoId') produtoId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo foi enviado');
    const result = await this.productsService.uploadProductImage(empresaId, produtoId, file);
    return {
      message: 'Upload realizado com sucesso',
      imageUrl: result.image_url,
    };
  }
}
