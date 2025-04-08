# Getting Started with TickTick MCP Server

This guide will walk you through setting up and using the TickTick MCP Server step-by-step.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Version 18 or higher
- **npm**: Usually comes with Node.js
- **TickTick account**: You need a TickTick account to access their API
- **TickTick Developer Access**: Register at the [TickTick Developer Center](https://developer.ticktick.com/manage)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/shidhincr/ticktick-mcpserver.git
cd ticktick-mcpserver
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Authentication

The TickTick MCP Server requires an access token to communicate with the TickTick API. Follow these steps to obtain one:

#### Register Your Application

1. Go to the [TickTick Developer Center](https://developer.ticktick.com/manage)
2. Sign in with your TickTick account
3. Create a new application
4. Set a redirect URI (can be a localhost URL for testing)
5. Note down your Client ID and Client Secret

#### Obtain an Access Token

The TickTick API uses OAuth2 for authentication. Here's how to get your access token:

1. **Authorization Request**:
   Direct your users to:
   ```
   https://ticktick.com/oauth/authorize?scope=tasks:read tasks:write&client_id=YOUR_CLIENT_ID&state=STATE&redirect_uri=YOUR_REDIRECT_URI&response_type=code
   ```

2. **Exchange Code for Token**:
   After authorization, TickTick will redirect to your redirect URI with a code parameter. Exchange this code for an access token:

   ```bash
   curl -X POST https://ticktick.com/oauth/token \
     -H "Authorization: Basic $(echo -n YOUR_CLIENT_ID:YOUR_CLIENT_SECRET | base64)" \
     -d "code=AUTHORIZATION_CODE&grant_type=authorization_code&scope=tasks:read tasks:write&redirect_uri=YOUR_REDIRECT_URI"
   ```

3. **Save the Access Token**:
   The response will include an access token. Save this token securely.

### 4. Set Environment Variables

Create a `.env` file in the root directory of your project and add your access token:

```
TICKTICK_ACCESS_TOKEN=your_access_token_here
```

Alternatively, set it via the command line:

```bash
export TICKTICK_ACCESS_TOKEN=your_access_token_here
```

### 5. Build and Run the Server

Build the TypeScript project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

You should see a message indicating that the server is running.

## Integrating with AI Assistants

To use this MCP server with AI assistants, you need to:

1. Ensure the server is running and accessible to the AI
2. Configure the AI to use the MCP protocol for TickTick actions
3. The AI can then call any of the implemented tools (see the [API Reference](API_REFERENCE.md) for details)

## Example Usage

Here's an example of how an AI assistant might use this MCP server:

1. **Getting Projects**:
   The AI calls `ticktick_get_projects` to retrieve a list of all projects with their IDs.

2. **Creating a Task**:
   The AI calls `ticktick_create_task` with details like:
   ```json
   {
     "title": "Complete project documentation",
     "project_id": "6226ff9877acee87727f6bca",
     "due_date": "2025-05-01T09:00:00+0000",
     "priority": 3
   }
   ```

3. **Updating a Task**:
   The AI can update task details using `ticktick_update_task`.

4. **Completing a Task**:
   When the user indicates a task is done, the AI can mark it as complete with `ticktick_complete_task`.

## Troubleshooting

Common issues and their solutions:

1. **Authentication Errors**:
   - Ensure your access token is correct and not expired
   - Verify you have the correct scopes (tasks:read, tasks:write)

2. **Server Won't Start**:
   - Ensure you have Node.js v18+
   - Check that all dependencies are installed
   - Verify the environment variable is set correctly

3. **Failed API Calls**:
   - Check your internet connection
   - Verify the project and task IDs are correct
   - Ensure your access token has the required permissions

For more help, please [open an issue](https://github.com/shidhincr/ticktick-mcpserver/issues) in the GitHub repository.

## Next Steps

- Learn about all available tools in the [API Reference](API_REFERENCE.md)
- Explore [example integrations](../examples)
- Contribute to the project by improving documentation or adding features