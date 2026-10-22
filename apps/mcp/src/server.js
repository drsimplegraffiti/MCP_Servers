import config from './config/index.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`MCP server (streamable HTTP) listening on port ${config.port}, endpoint POST /mcp (no auth)`);
  console.log(`API base: ${config.apiBaseUrl}`);
});
