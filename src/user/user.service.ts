import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from 'src/models/user.model';
import { handelResponse } from 'src/utils/handleResponse';
import { message } from 'src/utils/messages';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RegistrationLoginInterface } from 'src/utils/interfaces/userInterface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
const salt: number = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      const userData: RegistrationLoginInterface = await this.userModel.save({
        ...createUserDto,
      });

      if (userData) {
        return handelResponse({
          statusCode: 201,
          message: `${createUserDto.role} ${message.REGISTER_SUCCESSFULLY}`,
        });
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const detail = error.driverError.detail;
        if (detail && detail.includes('already exists')) {
          return handelResponse({
            statusCode: 400,
            message: 'Unique constraint error: The resource already exists.',
          });
        } else {
          return handelResponse({
            statusCode: 500,
            message: message.PLEASE_TRY_AGAIN,
          });
        }
      } else {
        return handelResponse({
          statusCode: 500,
          message: message.PLEASE_TRY_AGAIN,
        });
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const userData: RegistrationLoginInterface = await this.userModel.findOne(
        {
          where: {
            email: loginUserDto.email,
          },
        },
      );

      if (userData) {
        const comparedPassword: boolean = await bcrypt.compare(
          loginUserDto.password,
          userData.password,
        );

        if (comparedPassword) {
          const token: string = await this.jwtService.signAsync({
            id: userData.id,
            role: userData.role,
          });

          return handelResponse({
            statusCode: 200,
            message: `${userData.role} ${message.LOGIN_SUCCESSFULLY}`,
            data: {
              token,
            },
          });
        } else {
          return handelResponse({
            statusCode: 400,
            message: `${userData.role} password ${message.NOT_MATCHED}`,
          });
        }
      } else {
        return handelResponse({
          statusCode: 404,
          message: `${message.EMAIL_NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }

  async viewProfile(req: any) {
    try {
      const userData: RegistrationLoginInterface = await this.userModel.findOne(
        {
          where: {
            id: req.user.id,
          },
        },
      );

      if (userData) {
        return handelResponse({
          statusCode: 200,
          message: `${userData.role} profile ${message.VIEW_SUCCESSFULLY}`,
          data: userData,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `${userData.role} data ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }

  async editProfile(req: any, updateUserDto: UpdateUserDto) {
    try {
      const userData = await this.userModel.update(req.user.id, {
        ...updateUserDto,
      });

      if (userData.affected > 0) {
        return handelResponse({
          statusCode: 202,
          message: `${req.user.role} profile ${message.UPDATE_SUCCESSFULLY}`,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Data ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      forgotPasswordDto.newPassword = await bcrypt.hash(
        forgotPasswordDto.newPassword,
        salt,
      );

      const userData = await this.userModel.update(
        { email: forgotPasswordDto.email },
        {
          password: forgotPasswordDto.newPassword,
        },
      );

      if (userData.affected > 0) {
        return handelResponse({
          statusCode: 202,
          message: `Password ${message.UPDATE_SUCCESSFULLY}`,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Email ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }

  async updatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    try {
      const comparedPassword: boolean = await bcrypt.compare(
        updatePasswordDto.password,
        req.user.password,
      );

      if (comparedPassword) {
        updatePasswordDto.newPassword = await bcrypt.hash(
          updatePasswordDto.newPassword,
          salt,
        );

        const userUpdatedData = await this.userModel.update(
          { id: req.user.id },
          {
            password: updatePasswordDto.newPassword,
          },
        );

        if (userUpdatedData.affected > 0) {
          return handelResponse({
            statusCode: 202,
            message: `Password ${message.UPDATE_SUCCESSFULLY}`,
          });
        } else {
          return handelResponse({
            statusCode: 404,
            message: `${req.user.role} ${message.NOT_FOUND}`,
          });
        }
      } else {
        return handelResponse({
          statusCode: 400,
          message: `Old password ${message.NOT_MATCHED}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }
}
