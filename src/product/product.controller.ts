import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('product/:id')
  productFindById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.productFindById(id);
  }

  @Get('product-all')
  productFindAll() {
    return this.productService.productFindAll();
  }

  @Post('create-product')
  @UseGuards(AuthGuard('jwt'))
  createProduct(createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productService.createProduct(createProductDto, user.email);
  }

  @Delete('product/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {

  }
}
