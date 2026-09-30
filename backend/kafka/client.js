import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
})
export const producer = kafka.producer()

export async function initKafka() {
    await producer.connect()
}