const Redis = require('ioredis');

const redis = new Redis({
  host: 'crack-serval-49813.upstash.io',
  port: 6379,
  password: 'AcKVAAIncDEzZjdlZThiM2QwM2M0OTQyYTk1NTY5NWMwMjllZTE0ZHAxNDk4MTM',
  tls: {}
});

redis.flushall()
  .then(() => {
    console.log('Redis database cleared');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error clearing Redis database:', err);
    process.exit(1);
  });
