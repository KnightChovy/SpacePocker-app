import nodemailer from "nodemailer";

type SendBookingConfirmedEmailInput = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  startTime: Date;
  endTime: Date;
};

type SendBookingRefundSuccessEmailInput = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  refundAmount: number;
  refundReason?: string;
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

  async sendPasswordResetOtpEmail(input: {
    to: string;
    customerName?: string;
    otp: string;
  }) {
    const greetingName = input.customerName || "ban";

    await this.transporter.sendMail({
      from: this.getFromAddress(),
      to: input.to,
      subject: "Yeu cau dat lai mat khau - SpacePocker",
      text: [
        `Xin chao ${greetingName},`,
        "",
        "Chung toi da nhan duoc yeu cau quen mat khau cua ban.",
        "Ma OTP de dat lai mat khau la:",
        input.otp,
        "",
        "Ma OTP co hieu luc trong 10 phut.",
        "Neu ban khong yeu cau, vui long bo qua email nay.",
      ].join("\n"),
      html: `
        <p>Xin chao <strong>${greetingName}</strong>,</p>
        <p>Chung toi da nhan duoc yeu cau quen mat khau cua ban.</p>
        <p>Ma OTP de dat lai mat khau la:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;"><strong>${input.otp}</strong></p>
        <p>Ma OTP co hieu luc trong <strong>10 phut</strong>.</p>
        <p>Neu ban khong yeu cau, vui long bo qua email nay.</p>
      `,
    });
  }

  async sendBookingRefundSuccessEmail(input: SendBookingRefundSuccessEmailInput) {
    const amount = `${Math.round(input.refundAmount).toLocaleString("vi-VN")} VND`;
    const reason = input.refundReason?.trim();

    await this.transporter.sendMail({
      from: this.getFromAddress(),
      to: input.to,
      subject: "Thong bao hoan tien thanh cong - SpacePocker",
      text: [
        `Xin chao ${input.customerName},`,
        "",
        "Booking cua ban da duoc huy boi quan ly va hoan tien thanh cong.",
        `Ma booking: ${input.bookingId}`,
        `Phong: ${input.roomName}`,
        `So tien da hoan: ${amount}`,
        ...(reason ? [`Ly do huy: ${reason}`] : []),
        "",
        "Neu can ho tro them, vui long lien he SpacePocker.",
      ].join("\n"),
      html: `
        <p>Xin chao <strong>${input.customerName}</strong>,</p>
        <p>Booking cua ban da duoc huy boi quan ly va <strong>hoan tien thanh cong</strong>.</p>
        <ul>
          <li><strong>Ma booking:</strong> ${input.bookingId}</li>
          <li><strong>Phong:</strong> ${input.roomName}</li>
          <li><strong>So tien da hoan:</strong> ${amount}</li>
          ${reason ? `<li><strong>Ly do huy:</strong> ${reason}</li>` : ""}
        </ul>
        <p>Neu can ho tro them, vui long lien he SpacePocker.</p>
      `,
    });
  }
}
