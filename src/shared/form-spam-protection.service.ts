import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

interface SubmissionVerification {
  captchaToken: string;
  clientIp: string;
  honeypot: string;
}

interface HcaptchaVerificationResponse {
  success?: boolean;
}

@Injectable()
export class FormSpamProtectionService {
  private readonly logger = new Logger(FormSpamProtectionService.name);
  private readonly attempts = new Map<
    string,
    { count: number; resetAt: number }
  >();
  private readonly attemptLimit = 5;
  private readonly windowMs = 15 * 60 * 1000;
  private readonly maximumTrackedIps = 10000;

  async verifySubmission({
    captchaToken,
    clientIp,
    honeypot,
  }: SubmissionVerification): Promise<void> {
    if (honeypot.trim()) {
      throw new ForbiddenException('Unable to verify this request.');
    }

    this.enforceRateLimit(clientIp);

    if (!captchaToken) {
      throw new ForbiddenException('Please complete the human verification.');
    }

    const secret = process.env.HCAPTCHA_SECRET_KEY;
    if (!secret) {
      this.logger.error('HCAPTCHA_SECRET_KEY is not configured.');
      throw new ServiceUnavailableException(
        'Form verification is temporarily unavailable.',
      );
    }

    let response: Response;
    try {
      const body = new URLSearchParams({
        secret,
        response: captchaToken,
      });
      if (clientIp) {
        body.set('remoteip', clientIp);
      }

      response = await fetch('https://api.hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(5000),
      });
    } catch (error) {
      this.logger.error(
        'Could not reach the hCaptcha verification service.',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Form verification is temporarily unavailable.',
      );
    }

    if (!response.ok) {
      this.logger.error(
        `hCaptcha verification returned HTTP ${response.status}.`,
      );
      throw new ServiceUnavailableException(
        'Form verification is temporarily unavailable.',
      );
    }

    let verification: HcaptchaVerificationResponse;
    try {
      verification = (await response.json()) as HcaptchaVerificationResponse;
    } catch (error) {
      this.logger.error(
        'Could not read the hCaptcha verification response.',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Form verification is temporarily unavailable.',
      );
    }

    if (verification.success !== true) {
      throw new ForbiddenException(
        'Human verification failed. Please try again.',
      );
    }
  }

  private enforceRateLimit(clientIp: string): void {
    const now = Date.now();

    for (const [ip, attempt] of this.attempts) {
      if (attempt.resetAt <= now) {
        this.attempts.delete(ip);
      }
    }

    if (!clientIp) {
      return;
    }

    const existing = this.attempts.get(clientIp);
    if (existing && existing.resetAt > now) {
      if (existing.count >= this.attemptLimit) {
        throw new HttpException(
          'Too many form submissions. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      existing.count += 1;
      return;
    }

    if (this.attempts.size >= this.maximumTrackedIps) {
      const oldestIp = this.attempts.keys().next().value as string | undefined;
      if (oldestIp) {
        this.attempts.delete(oldestIp);
      }
    }

    this.attempts.set(clientIp, {
      count: 1,
      resetAt: now + this.windowMs,
    });
  }
}
