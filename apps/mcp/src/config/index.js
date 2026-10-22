import 'dotenv/config';

const config = {
  port: parseInt(process.env.MCP_PORT || '3001', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4002',
};

export default config;
