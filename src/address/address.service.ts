import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/models/address.model';
import { Repository } from 'typeorm';
import { handelResponse } from 'src/utils/handleResponse';
import { message } from 'src/utils/messages';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressModel: Repository<Address>,
  ) {}

  async addAddress(req: any, createAddressDto: CreateAddressDto) {
    try {
      createAddressDto.user_id = req.user.id;
      const userData: any = await this.addressModel.save({
        ...createAddressDto,
      });

      if (userData) {
        return handelResponse({
          statusCode: 201,
          message: `Address ${message.ADDED_SUCCESSFULLY}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async listOfAddress(req: any) {
    try {
      const userAddressData: any = await this.addressModel.find({
        where: {
          user_id: req.user.id,
        },
      });

      return handelResponse({
        statusCode: 200,
        message: `Address ${message.VIEW_SUCCESSFULLY}`,
        data: userAddressData,
      });
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async viewAddress(params: any) {
    try {
      const userAddressData: any = await this.addressModel.findOne({
        where: {
          id: params.address_id,
        },
      });

      if (userAddressData) {
        return handelResponse({
          statusCode: 200,
          message: `Address ${message.VIEW_SUCCESSFULLY}`,
          data: userAddressData,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Address ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async updateAddress(params: any, updateAddressDto: UpdateAddressDto) {
    try {
      const userAddressData: any = await this.addressModel.update(
        { id: params.address_id },
        {
          ...updateAddressDto,
        },
      );

      if (userAddressData.affected > 0) {
        return handelResponse({
          statusCode: 202,
          message: `Address ${message.UPDATE_SUCCESSFULLY}`,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Address ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async deleteAddress(params: any) {
    try {
      const userAddressData: any = await this.addressModel.delete({
        id: params.address_id,
      });

      if (userAddressData.affected > 0) {
        return handelResponse({
          statusCode: 200,
          message: `Address ${message.DELETED_SUCCESSFULLY}`,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Address ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
