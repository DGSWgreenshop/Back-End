import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async productFindById(id: number): Promise<Product> {
    try {
      const product: Product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (err) {
      throw new NotFoundException('Product not found');
    }
  }

  async productFindAll(): Promise<Product[]> {
    const products: Product[] = await this.prisma.product.findMany();

    return products;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    email: string,
  ): Promise<Product> {
    const { title, description, sale, price, link } = createProductDto;

    const product: Product = await this.prisma.product.create({
      data: { title, description, sale, price, link, autherEmail: email },
    });

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException();
    }
  }
}
