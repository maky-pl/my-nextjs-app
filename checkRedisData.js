const Redis = require('ioredis');

const redis = new Redis({
  host: 'crack-serval-49813.upstash.io',
  port: 6379,
  password: 'AcKVAAIncDEzZjdlZThiM2QwM2M0OTQyYTk1NTY5NWMwMjllZTE0ZHAxNDk4MTM',
  tls: {}
});

async function checkData() {
  try {
    const events = await redis.lrange('events', 0, -1);
    console.log('Raw events from Redis:', events);
    const parsedEvents = events.map(event => JSON.parse(event));
    console.log('Parsed events:', parsedEvents);
  } catch (error) {
    console.error('Error fetching events from Redis:', error);
  } finally {
    redis.disconnect();
  }
}

checkData();
