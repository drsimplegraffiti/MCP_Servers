import 'dotenv/config';

const config = {
  port: parseInt(process.env.PORT || '4002', 10),
  mongoUri: process.env.MONGO_URI,
};

export default config;
