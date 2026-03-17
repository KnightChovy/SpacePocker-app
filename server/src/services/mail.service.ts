import nodemailer from "nodemailer";

type SendBookingConfirmedEmailInput = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  startTime: Date;
  endTime: Date;
};

export default class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  private getFromAddress() {
    return (
      process.env.SMTP_FROM ||
      process.env.SMTP_USER ||
      "no-reply@spacepocker.local"
    );
  }

  async sendBookingConfirmedEmail(input: SendBookingConfirmedEmailInput) {
    const start = input.startTime.toLocaleString("vi-VN");
    const end = input.endTime.toLocaleString("vi-VN");
    console.log(input);
    await this.transporter.sendMail({
      from: this.getFromAddress(),
      to: input.to,
      subject: "Booking thanh cong - SpacePocker",
      text: [
        `Xin chao ${input.customerName},`,
        "",
        "Booking cua ban da duoc thanh toan thanh cong.",
        `Ma booking: ${input.bookingId}`,
        `Phong: ${input.roomName}`,
        `Bat dau: ${start}`,
        `Ket thuc: ${end}`,
        "",
        "Cam on ban da su dung SpacePocker.",
      ].join("\n"),
      html: `
        <p>Xin chao <strong>${input.customerName}</strong>,</p>
        <p>Booking cua ban da duoc thanh toan thanh cong.</p>
        <ul>
          <li><strong>Ma booking:</strong> ${input.bookingId}</li>
          <li><strong>Phong:</strong> ${input.roomName}</li>
          <li><strong>Bat dau:</strong> ${start}</li>
          <li><strong>Ket thuc:</strong> ${end}</li>
        </ul>
        <p>Cam on ban da su dung SpacePocker.</p>
      `,
    });
  }
}
