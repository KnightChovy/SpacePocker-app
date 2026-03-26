import { getRabbitChannel } from "../lib/rabbitmq";

export const BOOKING_MAIL_QUEUE = "booking.confirmed.mail.queue";
export const BOOKING_REFUND_MAIL_QUEUE = "booking.refund.success.mail.queue";
export const BOOKING_CANCELLED_NO_REFUND_MAIL_QUEUE =
  "booking.cancelled.norefund.mail.queue";

export type BookingConfirmedMailJob = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  startTime: string;
  endTime: string;
};

export type BookingRefundSuccessMailJob = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  refundAmount: number;
  refundReason?: string;
};

export type BookingCancelledNoRefundMailJob = {
  to: string;
  customerName: string;
  bookingId: string;
  roomName: string;
  startTime: string;
  endTime: string;
};

export default class MailQueueService {
  async publishBookingConfirmedEmailJob(payload: BookingConfirmedMailJob) {
    const channel = await getRabbitChannel();
    await channel.assertQueue(BOOKING_MAIL_QUEUE, { durable: true });
    channel.sendToQueue(
      BOOKING_MAIL_QUEUE,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: "application/json",
      },
    );
  }

  async publishBookingRefundSuccessEmailJob(
    payload: BookingRefundSuccessMailJob,
  ) {
    const channel = await getRabbitChannel();
    await channel.assertQueue(BOOKING_REFUND_MAIL_QUEUE, { durable: true });
    channel.sendToQueue(
      BOOKING_REFUND_MAIL_QUEUE,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: "application/json",
      },
    );
  }

  async publishBookingCancelledNoRefundEmailJob(
    payload: BookingCancelledNoRefundMailJob,
  ) {
    const channel = await getRabbitChannel();
    await channel.assertQueue(BOOKING_CANCELLED_NO_REFUND_MAIL_QUEUE, {
      durable: true,
    });
    channel.sendToQueue(
      BOOKING_CANCELLED_NO_REFUND_MAIL_QUEUE,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: "application/json",
      },
    );
  }
}
