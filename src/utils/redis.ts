import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

console.log('Connected to Upstash Redis:', process.env.UPSTASH_REDIS_URL);

export default redis;
