import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { ResponseInterface } from 'src/utils/interfaces/commonInterface';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/utils/enum';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  //Admin, Customer, and Vendor can add address
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add-address')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  addAddress(
    @Request() request,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<ResponseInterface> {
    return this.addressService.addAddress(request, createAddressDto);
  }

  //Admin, Customer, and Vendor can view list of their addresses
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('list-of-address')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  listOfAddress(@Request() request): Promise<ResponseInterface> {
    return this.addressService.listOfAddress(request);
  }

  //Admin, Customer, and Vendor can view their address
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('view-address/:address_id')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  viewAddress(@Param() params: any): Promise<ResponseInterface> {
    return this.addressService.viewAddress(params);
  }

  //Admin, Customer, and Vendor can edit their address
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update-address/:address_id')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  updateAddress(
    @Param() params: any,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<ResponseInterface> {
    return this.addressService.updateAddress(params, updateAddressDto);
  }

  //Admin, Customer, and Vendor can delete their address
  // Guards for authorization.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete-address/:address_id')
  // Add roles based on API
  @Roles(Role.Admin, Role.Customer, Role.Vendor)
  deleteAddress(@Param() params: any): Promise<ResponseInterface> {
    return this.addressService.deleteAddress(params);
  }
}
