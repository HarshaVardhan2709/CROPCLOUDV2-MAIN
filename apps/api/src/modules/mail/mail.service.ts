import { Injectable, Logger } from '@nestjs/common';

const nodemailer = require('nodemailer');
const { Resend } = require('resend');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendOtpEmail(email: string, code: string) {
    const mode = process.env.OTP_DELIVERY_MODE ?? 'console';

    if (mode === 'resend') {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.MAIL_FROM;

      if (!apiKey || !from) {
        this.logger.warn('Resend mode requested but RESEND_API_KEY or MAIL_FROM is missing. Falling back to console OTP delivery.');
        this.logger.log(`DEV OTP for ${email}: ${code}`);
        return { delivered: false, devOtp: code };
      }

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: email,
        subject: 'CropCloud verification code',
        text: `Your CropCloud verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your CropCloud verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
      });

      return { delivered: true };
    }

    if (mode !== 'smtp') {
      this.logger.log(`DEV OTP for ${email}: ${code}`);
      return { delivered: false, devOtp: code };
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM ?? user;

    if (!host || !user || !pass || !from) {
      this.logger.warn('SMTP mode requested but SMTP credentials are incomplete. Falling back to console OTP delivery.');
      this.logger.log(`DEV OTP for ${email}: ${code}`);
      return { delivered: false, devOtp: code };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'CropCloud verification code',
      text: `Your CropCloud verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your CropCloud verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });

    return { delivered: true };
  }

  async sendVerificationEmail(email: string, verificationUrl: string) {
    const mode = process.env.OTP_DELIVERY_MODE ?? 'console';

    if (mode === 'resend') {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.MAIL_FROM;

      if (!apiKey || !from) {
        this.logger.warn('Resend mode requested but RESEND_API_KEY or MAIL_FROM is missing. Falling back to console email verification delivery.');
        this.logger.log(`VERIFY EMAIL for ${email}: ${verificationUrl}`);
        return { delivered: false, devUrl: verificationUrl };
      }

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: email,
        subject: 'Verify your CropCloud account',
        text: `Verify your CropCloud account by opening this link: ${verificationUrl}`,
        html: `<p>Verify your CropCloud account by clicking <a href="${verificationUrl}">this link</a>.</p>`,
      });

      return { delivered: true };
    }

    if (mode === 'smtp') {
      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT ?? 587);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const from = process.env.MAIL_FROM ?? user;

      if (!host || !user || !pass || !from) {
        this.logger.warn('SMTP mode requested but SMTP credentials are incomplete. Falling back to console email verification delivery.');
        this.logger.log(`VERIFY EMAIL for ${email}: ${verificationUrl}`);
        return { delivered: false, devUrl: verificationUrl };
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from,
        to: email,
        subject: 'Verify your CropCloud account',
        text: `Verify your CropCloud account by opening this link: ${verificationUrl}`,
        html: `<p>Verify your CropCloud account by clicking <a href="${verificationUrl}">this link</a>.</p>`,
      });

      return { delivered: true };
    }

    this.logger.log(`VERIFY EMAIL for ${email}: ${verificationUrl}`);
    return { delivered: false, devUrl: verificationUrl };
  }
}
