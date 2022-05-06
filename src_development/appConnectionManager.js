var amqp = require('amqplib/callback_api');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');
const MessageEmitter = new EventEmitter;

class AppConnectionManager {

  connect(queueName) {
    this.queueName = queueName;
    let self = this
    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) { throw error0; }
      connection.createChannel(function (error1, channel) {
        if (error1) { throw error1; }
        self.channel = channel;
        channel.assertQueue('', { exclusive: true }, async function (error2, q) {
          if (error2) { throw error2; }
          self.q = q;
          channel.consume(q.queue, function (msg) {
            MessageEmitter.emit(msg.properties.correlationId, msg);
            channel.ack(msg);
          }, { noAck: false });
        });
      });
    });
  }

  async get(msg) {
    if (!this.channel) { console.log('ERROR Connection Is Not Created!'); return 0 };
    let correlationId = uuidv4();
    const promise = new Promise((resolve, reject) => {
      this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(msg)), {
        correlationId: correlationId,
        replyTo: this.q.queue,
        type: 'request',
      });
      console.log(`[ ]=----(${msg.request} request)---->`);
      MessageEmitter.once(correlationId, (msg) => {
        console.log(`[ ]<----(responce)----=`);
        resolve(JSON.parse(msg.content.toString()))
      })
    })
    return promise;
  }

  async send(msg) {
    if (!this.channel) { console.log('ERROR Connection Is Not Created!'); return 0 };
    this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(msg)), {
    });
    console.log(`[ ]-----(${msg.request})---->`);
  }
}
exports.AppConnectionManager = AppConnectionManager;

