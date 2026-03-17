import dotenv from "dotenv";
import MailService from "../services/mail.service";
import {
  BOOKING_MAIL_QUEUE,
  BookingConfirmedMailJob,
} from "../services/mailQueue.service";
import { getRabbitChannel } from "../lib/rabbitmq";

dotenv.config();

const mailService = new MailService();

async function startWorker() {
  const channel = await getRabbitChannel();
  await channel.assertQueue(BOOKING_MAIL_QUEUE, { durable: true });
  channel.prefetch(5);

  console.log(`[mail-worker] Listening queue: ${BOOKING_MAIL_QUEUE}`);

  channel.consume(BOOKING_MAIL_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(
        msg.content.toString(),
      ) as BookingConfirmedMailJob;
      await mailService.sendBookingConfirmedEmail({
        to: payload.to,
        customerName: payload.customerName,
        bookingId: payload.bookingId,
        roomName: payload.roomName,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
      });
      channel.ack(msg);
    } catch (error) {
      console.error("[mail-worker] Failed processing message:", error);
      channel.nack(msg, false, false);
    }
  });
}

startWorker().catch((error) => {
  console.error("[mail-worker] Startup failed:", error);
  process.exit(1);
});
