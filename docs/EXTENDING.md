# Extending TickTick MCP Server

This guide explains how to extend the TickTick MCP Server with additional tools and capabilities.

## Understanding the Architecture

The TickTick MCP Server follows the Model Context Protocol (MCP) specification, which defines a standardized way for AI models to interact with external tools and services. The architecture consists of:

1. **Tools**: Defined interfaces that AI models can invoke
2. **Request Handlers**: Functions that process tool invocation requests
3. **Server Transport**: Mechanism for communication between the AI and the server

## Adding New Tools

To add a new tool to the TickTick MCP Server, follow these steps:

### 1. Define the Tool Interface

Create a new Tool definition in `src/index.ts`:

```typescript
const MY_NEW_TOOL: Tool = {
  name: "ticktick_my_new_tool",
  description: "Description of what the tool does",
  inputSchema: {
    type: "object",
    properties: {
      // Define input parameters
      param1: {
        type: "string",
        description: "Description of parameter 1",
      },
      param2: {
        type: "number",
        description: "Description of parameter 2",
      },
    },
    required: ["param1"], // List required parameters
  },
};
```

### 2. Add Type Guard for Arguments

Define a type guard function to validate the input arguments:

```typescript
function isMyNewToolArgs(args: unknown): args is {
  param1: string;
  param2?: number;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "param1" in args &&
    typeof (args as { param1: string }).param1 === "string"
  );
}
```

### 3. Implement Tool Handler

Add the tool handler in the `CallToolRequestSchema` handler:

```typescript
// Inside the CallToolRequestSchema handler
if (name === "ticktick_my_new_tool") {
  if (!isMyNewToolArgs(args)) {
    throw new Error("Invalid arguments for ticktick_my_new_tool");
  }

  // Implement the logic for the new tool
  // ...

  return {
    content: [{
      type: "text",
      text: `Result of the operation: ...`
    }],
    isError: false,
  };
}
```

### 4. Register the Tool

Add the new tool to the list returned by the `ListToolsRequestSchema` handler:

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // Existing tools...
    MY_NEW_TOOL, // Add your new tool here
  ],
}));
```

## Working with TickTick API

The TickTick API offers many endpoints not yet implemented in this server. To add new capabilities:

1. Review the [TickTick API Documentation](https://developer.ticktick.com/docs#/openapi)
2. Identify the endpoints you want to use
3. Implement appropriate tools for those endpoints

### Example: Implementing a Tool for Tags

```typescript
// 1. Define the tool
const GET_TAGS_TOOL: Tool = {
  name: "ticktick_get_tags",
  description: "Get all tags from TickTick",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// 2. Define type guard
function isGetTagsArgs(args: unknown): args is {} {
  return typeof args === "object" && args !== null;
}

// 3. Implement handler
if (name === "ticktick_get_tags") {
  if (!isGetTagsArgs(args)) {
    throw new Error("Invalid arguments for ticktick_get_tags");
  }

  // Call TickTick API
  const response = await axios.get(
    `${TICKTICK_API_BASE_URL}/tags`,
    { headers: getHeaders() }
  );

  const tags = response.data;

  return {
    content: [{
      type: "text",
      text: tags.length > 0 
        ? tags.map(tag => `- ${tag.name}`).join('\n') 
        : "No tags found"
    }],
    isError: false,
  };
}

// 4. Register in tool list
// ... add GET_TAGS_TOOL to the tools array ...
```

## Adding Authentication Methods

The current implementation uses a bearer token for authentication. If you want to support other authentication methods:

1. Modify the `getHeaders` function to support different auth methods
2. Update environment variable handling

Example for API Key authentication:

```typescript
// Check for API key
const TICKTICK_API_KEY = process.env.TICKTICK_API_KEY;
const TICKTICK_API_SECRET = process.env.TICKTICK_API_SECRET;

if (!TICKTICK_API_KEY || !TICKTICK_API_SECRET) {
  console.error("Error: TICKTICK_API_KEY and TICKTICK_API_SECRET environment variables are required");
  process.exit(1);
}

// Headers for API requests with API key
const getHeaders = () => {
  return {
    'X-API-Key': TICKTICK_API_KEY,
    'X-API-Secret': TICKTICK_API_SECRET,
    'Content-Type': 'application/json',
  };
};
```

## Error Handling and Logging

To improve error handling and logging:

1. Add a logging library like Winston or Pino
2. Create structured error responses
3. Implement retry logic for API calls

Example of enhanced error handling:

```typescript
try {
  // API call or operation
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      return {
        content: [{
          type: "text",
          text: `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
        }],
        isError: true,
      };
    } else if (error.request) {
      // The request was made but no response was received
      logger.error(`Network Error: No response received`);
      return {
        content: [{
          type: "text",
          text: `Network Error: Unable to connect to TickTick API`
        }],
        isError: true,
      };
    }
  }
  
  // Generic error handling
  logger.error(`Error: ${error.message}`);
  return {
    content: [{
      type: "text",
      text: `Error: ${error.message}`
    }],
    isError: true,
  };
}
```

## Testing Your Extensions

1. Create unit tests for your new tools
2. Test with actual AI models that support MCP
3. Document the new capabilities

## Publishing Your Extensions

If you've extended the server with useful functionality:

1. Fork the repository
2. Implement your changes
3. Create a pull request with clear documentation of the new features
4. Include test cases that demonstrate the functionality
