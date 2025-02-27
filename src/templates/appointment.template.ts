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

  async appointmentReply(
    name: string,
    email: string,
    company: string,
    country: string,
    phone: string,
    message: string,
    date: string,
    time: string,
    zone: string,
  ) {
    const emailBody = `<div>
    <h3>New Appointment Booking</h3>
    <p style="margin-bottom: 10px;">  </p>

    <p><strong>Name : </strong>${name}</p>
    <p><strong>Email : </strong>${email}</p>
    <p><strong>Company : </strong>${company}</p>
    <p><strong>Country : </strong>${country}</p>
    <p><strong>Phone Number : </strong>${phone}</p>
    <p><strong>Message : </strong>${message}</p>
    <p><strong>Date : </strong>${date}</p>
    <p><strong>Time : </strong>${time}</p>
    <p><strong>Time Zone : </strong>${zone}</p>

    <p style="margin-bottom: 10px;">  </p>
    <h4 style="margin-bottom: 0px;">Best regards,</h4>
    <p>Syneris Solutions (Pvt) Ltd</p>
</div>`;

    return emailBody;
  }
}
