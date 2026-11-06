import {
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { FormSpamProtectionService } from './form-spam-protection.service';

describe('FormSpamProtectionService', () => {
  let service: FormSpamProtectionService;
  let fetchSpy: jest.SpyInstance;
  const originalSecret = process.env.HCAPTCHA_SECRET_KEY;

  beforeEach(() => {
    process.env.HCAPTCHA_SECRET_KEY = 'test-secret';
    service = new FormSpamProtectionService();
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ success: true }), { status: 200 }),
        ),
      );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    if (originalSecret === undefined) {
      delete process.env.HCAPTCHA_SECRET_KEY;
    } else {
      process.env.HCAPTCHA_SECRET_KEY = originalSecret;
    }
  });

  it('verifies a CAPTCHA before accepting a submission', async () => {
    await expect(
      service.verifySubmission({
        captchaToken: 'valid-token',
        clientIp: '192.0.2.1',
        honeypot: '',
      }),
    ).resolves.toBeUndefined();

    const [url, options] = fetchSpy.mock.calls[0] as [
      RequestInfo | URL,
      RequestInit,
    ];
    expect(url).toBe('https://api.hcaptcha.com/siteverify');
    expect(options.method).toBe('POST');
    expect((options.body as URLSearchParams).toString()).toContain(
      'response=valid-token',
    );
  });

  it('rejects submissions that fill the honeypot without contacting hCaptcha', async () => {
    await expect(
      service.verifySubmission({
        captchaToken: 'valid-token',
        clientIp: '192.0.2.1',
        honeypot: 'bot-filled-value',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects unsuccessful CAPTCHA verification', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    );

    await expect(
      service.verifySubmission({
        captchaToken: 'invalid-token',
        clientIp: '192.0.2.1',
        honeypot: '',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('limits repeated submissions from one client IP', async () => {
    const submission = {
      captchaToken: 'valid-token',
      clientIp: '192.0.2.2',
      honeypot: '',
    };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await service.verifySubmission(submission);
    }

    await expect(service.verifySubmission(submission)).rejects.toThrow(
      'Too many form submissions. Please try again later.',
    );
    expect(fetchSpy).toHaveBeenCalledTimes(5);
  });

  it('fails closed when the hCaptcha secret is missing', async () => {
    delete process.env.HCAPTCHA_SECRET_KEY;

    await expect(
      service.verifySubmission({
        captchaToken: 'valid-token',
        clientIp: '192.0.2.3',
        honeypot: '',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
