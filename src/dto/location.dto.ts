// location.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateLocationDto  {
  @IsNotEmpty()
  @IsString()
  cityName: string;

  @IsNotEmpty()
  @IsNumber()
  cityCode: number;

  @IsNotEmpty()
  @IsString()
  streetName: string;

  @IsNotEmpty()
  @IsNumber()
  buildingNumber: number;

  @IsOptional()
  @IsString()
  buildingEntarence?: string;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  apartment?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
