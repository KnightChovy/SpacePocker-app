import amqp, { Channel, ChannelModel } from "amqplib";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const getRabbitUrl = () => process.env.RABBITMQ_URL || "amqp://localhost:5672";

export async function getRabbitChannel(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  const conn = await amqp.connect(getRabbitUrl());
  connection = conn;
  conn.on("close", () => {
    connection = null;
    channel = null;
  });
  conn.on("error", () => {
    connection = null;
    channel = null;
  });

  const createdChannel = await conn.createChannel();
  channel = createdChannel;
  return createdChannel;
}

export async function closeRabbitConnection() {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}
