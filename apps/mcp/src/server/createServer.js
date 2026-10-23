import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../tools/index.js';
import { registerResources } from '../resources/index.js';
import { registerPrompts } from '../prompts/index.js';

export function createMcpServer() {
    const server = new McpServer(
        {
            name: 'NTA-news-MCP-Server',
            version: '1.0.0',
            description: 'NTA news in Nigeria',
        },
        { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );

    registerTools(server);
    registerResources(server);
    registerPrompts(server);

    return server;
}
