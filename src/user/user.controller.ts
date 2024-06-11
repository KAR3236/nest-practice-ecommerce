import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/utils/enum';
import { ResponseInterface } from 'src/utils/interfaces/commonInterface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Admin, Customer, and Vendor can register
  @Post('registration')
  registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface> {
    return this.userService.registration(createUserDto);
  }

  //Admin, Customer, and Vendor can login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<ResponseInterface> {
    return this.userService.login(loginUserDto);
  }

  //Admin, Customer, and Vendor can view their profile
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('view-profile')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  viewProfile(@Request() request): Promise<ResponseInterface> {
    return this.userService.viewProfile(request);
  }

  //Admin, Customer, and Vendor can edit their profile
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('edit-profile')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  editProfile(
    @Request() request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseInterface> {
    return this.userService.editProfile(request, updateUserDto);
  }

  //Admin, Customer, and Vendor can change password without login
  @Put('forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseInterface> {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  //Admin, Customer, and Vendor can change password with login
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update-password')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  updatePassword(
    @Request() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseInterface> {
    return this.userService.updatePassword(request, updatePasswordDto);
  }
}
