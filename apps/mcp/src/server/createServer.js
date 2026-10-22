import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../tools/index.js';
import { registerResources } from '../resources/index.js';
import { registerPrompts } from '../prompts/index.js';

export function createMcpServer() {
  const server = new McpServer(
    {
      name: 'posts-api-mcp',
      version: '1.0.0',
      description: 'MCP server that exposes Posts & Comments API as tools',
    },
    { capabilities: { tools: {}, resources: {}, prompts: {} } }
  );

  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  return server;
}
