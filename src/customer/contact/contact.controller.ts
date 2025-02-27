import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactUsDto } from './dto/contact-us.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('direct')
  async contactUs(@Body() dto: ContactUsDto) {
    return await this.contactService.contactUs(dto);
  }
}
