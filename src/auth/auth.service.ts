import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Product, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUser(email: string): Promise<User> {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(
          '해당 이메일로 등록된 사용자를 찾을 수 없습니다.',
        );
      }

      return user;
    } catch (err) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다: ' + err.message);
    }
  }

  async loginUser(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialDto;

    const user: User = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: { email: string } = { email };
      const accessToken: string = await this.jwtService.signAsync(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, birth } = createUserDto;

    const getEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (getEmail) {
      throw new BadRequestException('Email already exists');
    }

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString().split('T')[0];

    const user: User = await this.prisma.user.create({
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

  async updateUser(updateUserDto: UpdateUserDto, email: string): Promise<User> {
    try {
      const { newUsername, newEmail, newPassword } = updateUserDto;

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      if (newPassword) {
        const salt = await bcrypt.genSalt();
        const hashedSalt = await bcrypt.hash(newPassword, salt);

        const user = await this.prisma.user.update({
          where: { email },
          data: {
            username: newUsername,
            password: hashedSalt,
            email: newEmail,
            update_date: formattedDate,
          },
        });

        return user;
      } else {
        const user = await this.prisma.user.update({
          where: { email },
          data: {
            username: newUsername,
            email: newEmail,
            update_date: formattedDate,
          },
        });

        return user;
      }
    } catch (err) {
      throw new InternalServerErrorException(
        '사용자 정보를 업데이트하는데 실패했습니다: ' + err.message,
      );
    }
  }

  async deleteUser(email: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { email } });
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async uploadImage(imagePath: string, id: number): Promise<void> {
    try {
      if (imagePath) {
        await this.prisma.product.update({
          where: { id },
          data: { imageUrl: imagePath },
        });
      } else {
        throw new NotFoundException('imageUrl 정보가 없습니다');
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
