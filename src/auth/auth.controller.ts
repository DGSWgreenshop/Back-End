import {
  Body,
  Controller,
  Delete, ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Base64DecodeInterceptorInterceptor } from './Interceptor/base64-decode-interceptor.interceptor';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto) {
    return this.authService.loginUser(authCredentialDto);
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Patch('user')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Body('email') email: string,
  ) {
    return this.authService.updateUser(updateUserDto, email);
  }

  @Delete('user')
  @UseGuards(AuthGuard())
  deleteUser(@GetUser() user: User) {
    return this.authService.deleteUser(user.email);
  }

  @UseInterceptors(
    Base64DecodeInterceptorInterceptor,
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './image',
        filename: (req, file, cb) => {
          const date = Date.now();
          const fileExtension = extname(file.originalname);
          const originalName = file.originalname.replace(fileExtension, '');

          return cb(null, `${originalName}-${date}${fileExtension}`);
        },
      }),
    }),
  )
  @Post('upload/image')
  @UseGuards(AuthGuard())
  uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.authService.uploadImage(image.path, id);
  }
}
