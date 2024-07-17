import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password, birth } = createUserDto;

    const getEmail = await this.prisma.user.findUnique({ where: { email } });
    if (getEmail) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const user = this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        birth,
        create_date: formattedDate,
        update_date: formattedDate,
      },
    });

    return user;
  }
}
