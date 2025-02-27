import { IsNotEmpty } from 'class-validator';

export class ContactUsDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  message: string;
}
