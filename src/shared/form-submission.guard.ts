import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { FormSpamProtectionService } from './form-spam-protection.service';

interface FormSubmissionBody {
  captchaToken?: unknown;
  website?: unknown;
}

@Injectable()
export class FormSubmissionGuard implements CanActivate {
  constructor(private readonly spamProtection: FormSpamProtectionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { body: FormSubmissionBody }>();
    const body = request.body as FormSubmissionBody | undefined;
    const { captchaToken, website } = body ?? {};

    await this.spamProtection.verifySubmission({
      captchaToken: typeof captchaToken === 'string' ? captchaToken : '',
      clientIp: request.ip ?? '',
      honeypot: typeof website === 'string' ? website : '',
    });

    return true;
  }
}
