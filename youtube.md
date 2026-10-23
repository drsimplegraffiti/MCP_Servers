# MCP Server in Node.js (Posts API)

## What is MCP?

- **Model Context Protocol (MCP)** — open standard for connecting LLMs(e.g
  ChatGPT) to external tools/data(e.g REST API, Database)

- Problem it solves: LLMs can't access real-world data or apps, can only generate text output.
  LLMs cannot persist data, cannot execute actions.
  LLMs cannot access local files.
  MCP connects AI/LLMs/AI agents to external systems safely.
  
- Roles: **Host** (app)
  → **Client** (connects to server) e.g **Cursor**, **Claude**. They are **Agents** and they own the model. Node_APP communicates with them via **MCP**
  → **Server** (exposes tools/resources/prompts) e.g **MCP Server**

- Protocol: **JSON-RPC 2.0** (requests, responses, notifications)

- **Transports:** stdio, HTTP+SSE, **Streamable HTTP** (used here)

- **Models:** LLMs (e.g ChatGPT)
  - Reads the prompts, tools, and resources from the server
  - Executes the tools and sends the results back to the server
- What MCP actually do:
  - Describe the protocol
  - Describe the transport
  - Describe the tools and resources
  - Describe the server
  - Describe the client

## Project Architecture

```
AI Client (opencode/Cursor/Claude/Inspector)
   │  JSON-RPC over Streamable HTTP → POST /mcp :3001
   ▼
MCP server (apps/mcp) ──fetch──► REST API (apps/api :4002) ──Mongoose──► MongoDB posts_db :27017
```

- Monorepo: **npm workspaces** (`apps/*`), ESM (`"type": "module"`), `dotenv`, `node --watch`

## MCP Primitives (3 capabilities)

1. **Tools** — model-invoked functions (7 total):
   - Posts: `search_news`, `delete_news`,`create_post`, `list_posts`, `get_post`, `update_post`, `delete_post`
   - Comments: `add_comment`, `list_comments`
2. **Resources** — context data: `posts-api-guide`. These are rules for creating data. LLMs reads these rules and use them as guides.
3. **Prompts** — templated workflows: Reusable instructions (create → update → get → delete)

## MCP Server Setup (`apps/mcp`)

- SDK: `@modelcontextprotocol/sdk` v1.32.1, `McpServer` class
- Transport: `StreamableHTTPServerTransport`, **stateless** (`sessionIdGenerator: undefined`; new server+transport per `POST /mcp`, closed on `res.close`)
- Server name: `posts-api-mcp` — endpoint `POST localhost:3001/mcp` (GET/DELETE → 405)
- Schemas: **Zod v4** at registration + manual validator inside handler (double validation)
- Results: `{ content: [{ type: 'text', text: JSON.stringify(...) }] }` via `textResult.js`
- Outbound: `fetch` wrapper (`apiClient.js`) → `API_BASE_URL`

## REST API (`apps/api`)

- Express 5 + Mongoose 9 + MongoDB (`posts_db`)
- Layers: routes → controllers → services → models; `HttpError` + error middleware
- Routes: `GET/POST /posts`, `GET/PUT/DELETE /posts/:id`, `GET/POST /posts/:id/comments`
- Cascade delete: deleting a post also `Comment.deleteMany({ postId })`

## Validation Rules (mirrored API + MCP)

- Post: title ≥5, author ≥3, category ∈ {tech, finance, lifestyle}, body ≥50 chars
- Comment: text ≥10 chars, commenter required

## Run & Test

```bash
npm run api   # REST API :4002
npm run mcp   # MCP server :3001
```

- Config: `opencode.json` registers `posts-api` → `http://localhost:3001/mcp`
- Inspector: `npx @modelcontextprotocol/inspector` or https://mcp.ziziyi.com/inspector
- Checks: `opencode mcp list`, curl JSON-RPC `tools/list`, `GET /health` on both apps
- Prompts: `/national-duty-post-workflow` in opencode/Cursor/Claude Desktop

## Key Takeaways

- MCP server = thin **JSON-RPC/tool facade** over a normal REST API
- Stateless Streamable HTTP = simple, scalable, no session store
- Tools vs Resources vs Prompts: _do_ vs _read_ vs _guide_
