import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto) {
    return
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
