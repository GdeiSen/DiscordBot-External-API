var amqp = require('amqplib/callback_api');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');
const MessageEmitter = new EventEmitter;

class AppConnectionManager {

  constructor(queueName) {
    this.queueName = queueName
  }

  connect() {
    let self = this
    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) { throw error0; }
      connection.createChannel(function (error1, channel) {
        if (error1) { throw error1; }
        self.channel = channel;
        channel.assertQueue('', { exclusive: true }, async function (error2, q) {
          if (error2) { throw error2; }
          self.q = q;
          channel.consume(q.queue, function (msg) { MessageEmitter.emit(msg.properties.correlationId, msg) }, { noAck: true });
        });
      });
    });
  }

  async send(msg) {
    if (!this.channel) return 0;
    let correlationId = uuidv4();
    const promise = new Promise((resolve, reject) => {
      this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(msg)), {
        correlationId: correlationId,
        replyTo: this.q.queue
      });
      console.log(' [x] Requesting', msg.request);
      MessageEmitter.once(correlationId, (msg) => {
        resolve(JSON.parse(msg.content.toString()))
      })
    })
    return promise;
  }

}
exports.AppConnectionManager = AppConnectionManager;

