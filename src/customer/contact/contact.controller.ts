import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactUsDto } from './dto/contact-us.dto';
import { FormSubmissionGuard } from '../../shared/form-submission.guard';

@Controller('contact')
@UseGuards(FormSubmissionGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('direct')
  async contactUs(@Body() dto: ContactUsDto) {
    return await this.contactService.contactUs(dto);
  }
}
