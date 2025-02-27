export class ContactUsTemplate {
  async contactUs(name: string) {
    const emailBody = `<div>
        <h3>Dear ${name},</h3>
        <p>Thank you for reaching out to Syneris Solutions. We have received your message and will get back to you as soon as possible.  </p>
        <p>If you have any urgent inquiries, feel free to contact us directly.</p>
        <p style="margin-bottom: 10px;">  </p>
        <h4 style="margin-bottom: 0px;">Best regards,</h4>
        <p>Syneris Solutions (Pvt) Ltd</p>
    </div>`;

    return emailBody;
  }

  async contactReply(name: string, email: string, message: string) {
    const emailBody = `<div>
        <h3>New message received from the contact form</h3>
        <p style="margin-bottom: 10px;">  </p>

        <p><strong>Name : </strong>${name}</p>
        <p><strong>Email : </strong>${email}</p>
        <p><strong>Message : </strong>${message}</p>

        <p style="margin-bottom: 10px;">  </p>
        <h4 style="margin-bottom: 0px;">Best regards,</h4>
        <p>Syneris Solutions (Pvt) Ltd</p>
    </div>`;

    return emailBody;
  }
}
