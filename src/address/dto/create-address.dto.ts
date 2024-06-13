import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  user_id?: number;

  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @IsString()
  @IsNotEmpty()
  address_line_2: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  pin_code: string;
}
