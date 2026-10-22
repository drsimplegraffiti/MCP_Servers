Model Context Protocol (MCP)
- What You Will Learn
- The Problem with LLMs – Powerful AI models can’t access real-world data or apps.
- What is MCP & Why It’s Necessary – MCP connects AI to external systems safely.
- Key Terminology – Agent, Host, Client, and Server explained simply.
- Tools, Resources, Prompts – The three core capabilities of MCP.
- Communication Structure (JSON-RPC) – How AI and servers exchange structured messages.
- Transport Layer (HTTP, SSE, Streamable HTTP) – How data flows between systems.
- AI Agent (Cursor Example) – How an agent chooses and uses tools automatically.
- Writing an MCP Server in Node.js – Build your own MCP server step-by-step.
- Testing with MCP Inspector & Cursor – Debug and validate your server.
(One more bullet is cut off at the bottom of the frame, partially hidden behind the video controls. It appears to start with “Deploying...” and mention “MCP” and “server”, but it isn’t legible enough to transcribe reliably.)

MCP -> Model Context Protocol that allows AI agents and LLM like ChatGPT to securely connect to application and execute actions.
LLM only generate text, MCP will generate context and execute action.
MCP is a Communication between a model and real world application.

List of Free MCP CLIENTs:

- Cursor: https://github.com/xybug/cursor
- MCP Inspector: https://github.com/xybug/mcp-inspector
- Claude Desktop: https://github.com/xybug/claude-desktop
- Any Ai containg MCP

### Model:

Large Language model: Brain like ChatGPT, Gemini

### MCP Server:

The external server that will be used to execute actions and send responses back
to the model. e.g your express with nodejs

MCP Terms:

- Tools: executable actions/capabilities e.g get_users(), get_posts(). They are
  just functions and they can be called by LLMs
  - Each tool defines:
    - Name
    - Description
    - Input parameters
    - Output parameters/Structure
- Resources: data that is used by tools, they are structured
  - These are like rules e.g to create_post() requires a title and body
  - format:
    - create_post(title, body)
    - update_post(post_id, title, body)
- Prompts:
  - reusable messages that can be used by LLMs to guide them. They are exposed
    by MCP Server. Entered in the chat window
  - The ones you entered by yourself are called System Prompts
  - Can be triggered with /prompt <name>

## Communication Layer

MCP uses JSON-RPC to send messages between the model and the server.
JSON-RPC is a protocol that defines how messages are structured and how they are

Example of Tool call request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_users",
    "arguments": []
  },
  "id": 1
}
```

Example of Tool call response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": [
      {
        "name": "John",
        "age": 30
      },
      {
        "name": "Jane",
        "age": 25
      }
    ]
  },
  "id": 1
}
```

![image](markdowns/images/paste_1792583988.png)

### Transport Layer
Delivery method for a conversation between the model and the server.
JSON-RPC is the Language they speak

Types:
1. HTTP
2. SSE: one-way stream
3. Streamable HTTP: advance version

### Full Execution Flow

This shows the complete trustworthy lifecycle.

1. User types prompt inside MCP Client (e.g., Cursor, Claude Desktop)
2. MCP Client sends prompt to the Model
3. Model analyzes intent
4. Model decides a Tool is required
5. Model generates a JSON-RPC tool call request
6. MCP Client sends this request to the MCP Server
7. MCP Server validates schema
8. MCP Server executes the Tool
9. MCP Server returns structured response (via HTTP or streaming)
10. MCP Client sends tool result back to the Model
11. Model continues reasoning
12. Final response shown to User in MCP Client

*(The next heading, "Important Clarifications:", is cut off at the bottom of the frame.)*




Client -> URL -> MCP Server
-> Hand Shake(/initialize) -> MCP Server -> Client

mcp inspector online:https://mcp.ziziyi.com/inspector
![image](markdowns/images/paste_1792591791.png)


The first method is `initialize`
```json
{
    "method":"initialize",
        "params":{
        "protocolVersion":"2025-11-25",
        "capabilities":{
            "sampling":{},
            "elicitation":{},
            "roots":{
                "listChanged":true,
            },
            "tasks":{
                "list":{},
                "cancel":{},
                "requests":{"sampling":{"createMessage":{}},"elicitation":{"create":{}}},
            },
        },
        "clientInfo":{
            "name":"inspector-client",
            "version":"0.20.0",
        },
    },
    "jsonrpc":"2.0",
    "id":0
}
```

![image](markdowns/images/paste_1792592020.png)


When you add the mcp (standalone example — in this repo it lives in `apps/mcp/src/`):
```js

import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();

app.use(cors());
app.use(express.json()); // see note below

function createMCPServer() {
  const server = new McpServer(
    {
      name: "CNN-News-MCP-Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Register your tools/resources/prompts here, e.g.:
  // server.tool("get-headlines", "Get latest headlines", {}, async () => ({
  //   content: [{ type: "text", text: "..." }],
  // }));

  return server;
}

app.post("/mcp", async (req, res) => {
  const server = createMCPServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

// In stateless mode, GET/DELETE aren't supported
app.get("/mcp", (req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.listen(5001, () => {
  console.log("MCP server listening on port 5001");
});
```


![image](markdowns/images/paste_1792593418.png)


Create `opencode.json`
```json

{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "posts-api": {
      "type": "remote",
      "url": "http://localhost:3001/mcp",
      "enabled": true
    }
  }
}
```

Confirm it
```bash
opencode mcp list
```

### Use with opencode

```bash
opencode
# then /mcp
# then select posts-api

or

opencode mcp use posts-api
```

![image](markdowns/images/paste_1792596494.png)

## Current project structure (this repo)

The standalone example above was split into two apps with separation of concerns:

```
apps/
├── api/                  # Express + MongoDB REST API (port 4002)
│   └── src/
│       ├── config/       # env config (PORT, MONGO_URI)
│       ├── models/       # Post, Comment (Mongoose schemas)
│       ├── validations/  # pure validation functions
│       ├── services/     # business logic (throws HttpError)
│       ├── controllers/  # request handlers
│       ├── routes/       # /posts + nested /posts/:id/comments
│       ├── middleware/   # 404 + central error handler
│       ├── app.js        # express app assembly
│       └── server.js     # DB connect + listen
└── mcp/                  # MCP server (port 3001, POST /mcp)
    └── src/
        ├── config/       # MCP_PORT, API_BASE_URL
        ├── client/       # fetch wrapper calling the REST API
        ├── validators/   # same rules as the API
        ├── tools/        # post.tools.js + comment.tools.js (7 tools)
        ├── resources/    # posts-api-guide resource
        ├── prompts/      # national-duty-post-workflow prompt
        ├── server/       # McpServer factory (registers tools/resources/prompts)
        ├── app.js        # stateless streamable HTTP /mcp endpoint
        └── server.js     # entry point
```

Run both (from repo root):

```bash
npm run api    # REST API on http://localhost:4002
npm run mcp    # MCP server on http://localhost:3001/mcp
```

Flow: MCP Client → POST /mcp (apps/mcp) → apiClient → REST API (apps/api) → MongoDB.
