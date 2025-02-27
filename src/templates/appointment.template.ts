export class AppointmentTemplate {
  async appointment(name: string) {
    const emailBody = `<div>
          <h3 style="margin-bottom: 0px;">Dear ${name},</h3>
          <p>You are invited to an online appointment with Syneris Solutions. Kindly confirm your availability by replying to this email. If you need to reschedule, please let us know at your earliest convenience.</p>
          <p> </p>
          <p style="margin-bottom: 0px;">We look forward to connecting with you.</p>
          <p>Thank you for choosing our services!</p>
          <p> </p>
          <h4 style="margin-bottom: 0px;">Best regards,</h4>
          <p>Syneris Solutions (Pvt) Ltd</p>
      </div>`;

    return emailBody;
  }
}
