import { escapeHtml } from '../shared/escape-html';

export class ContactUsTemplate {
  async contactUs(name: string) {
    const emailBody = `<div>
        <h3>Dear ${escapeHtml(name)},</h3>
        <p>Thank you for reaching out to Syneris Solutions. We have received your message and will get back to you as soon as possible.  </p>
        <p>If you have any urgent inquiries, feel free to contact us directly.</p>
        <p style="margin-bottom: 10px;">  </p>
        <h4 style="margin-bottom: 0px;">Best regards,</h4>
        <p>Syneris Solutions (Pvt) Ltd</p>
    </div>`;

    return emailBody;
  }

  async contactReply(
    name: string,
    email: string,
    company: string,
    country: string,
    phone: string,
    message: string,
  ) {
    const emailBody = `<div>
        <h3>New message received from the contact form</h3>
        <p style="margin-bottom: 10px;">  </p>

        <p><strong>Name : </strong>${escapeHtml(name)}</p>
        <p><strong>Email : </strong>${escapeHtml(email)}</p>
        <p><strong>Company : </strong>${escapeHtml(company)}</p>
        <p><strong>Country : </strong>${escapeHtml(country ?? '')}</p>
        <p><strong>Phone Number : </strong>${escapeHtml(phone ?? '')}</p>
        <p><strong>Message : </strong>${escapeHtml(message ?? '')}</p>

        <p style="margin-bottom: 10px;">  </p>
        <h4 style="margin-bottom: 0px;">Best regards,</h4>
        <p>Syneris Solutions (Pvt) Ltd</p>
    </div>`;

    return emailBody;
  }
}
