# TickTick MCP Server

A Model Context Protocol (MCP) server implementation for TickTick, the popular task management application. This server allows AI assistants to interact with TickTick through the TickTick Open API.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 📋 Features

- Get tasks from projects
- Create new tasks with details like due dates, priorities, and descriptions
- Update existing tasks
- Mark tasks as complete
- Delete tasks
- Get list of projects
- Create new projects with custom properties

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- TickTick Developer account
- TickTick API Access Token

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/shidhincr/ticktick-mcpserver.git
   cd ticktick-mcpserver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Set the environment variable with your access token:
   ```bash
   export TICKTICK_ACCESS_TOKEN=your_access_token_here
   ```

5. Start the server:
   ```bash
   npm start
   ```

## 🔑 Authentication Setup

### 1. Register a TickTick Developer Account

1. Visit [TickTick Developer Center](https://developer.ticktick.com/manage)
2. Create an account and register your application
3. Get the client ID and client secret

### 2. Get Access Token

Follow the OAuth2 flow to obtain an access token:

1. **Redirect users to TickTick authorization page:**
   ```
   https://ticktick.com/oauth/authorize?scope=tasks:read tasks:write&client_id=YOUR_CLIENT_ID&state=STATE&redirect_uri=YOUR_REDIRECT_URI&response_type=code
   ```

2. **Exchange the received code for an access token:**
   Make a POST request to `https://ticktick.com/oauth/token` with:
   - Header: Basic authentication with your client_id and client_secret
   - Body (application/x-www-form-urlencoded):
     - code: the received authorization code
     - grant_type: authorization_code
     - scope: tasks:read tasks:write
     - redirect_uri: your redirect URI

3. Store the received access token securely.

## 🛠️ Available Tools

The server implements the following tools for AI interaction:

### Task Management

1. **`ticktick_get_tasks`** - Get tasks from a specific project or all projects
   ```typescript
   {
     project_id?: string; // Optional project ID
     limit?: number;      // Optional result limit (default: 10)
   }
   ```

2. **`ticktick_create_task`** - Create a new task
   ```typescript
   {
     title: string;       // Required: Task title
     content?: string;    // Optional: Task content
     desc?: string;       // Optional: Task description
     project_id: string;  // Required: Project ID
     due_date?: string;   // Optional: Due date (ISO format)
     priority?: number;   // Optional: Priority (0, 1, 3, 5)
     is_all_day?: boolean; // Optional: All-day task flag
   }
   ```

3. **`ticktick_update_task`** - Update an existing task
   ```typescript
   {
     project_id: string;  // Required: Project ID
     task_id: string;     // Required: Task ID
     title?: string;      // Optional: New title
     // ... other task properties
   }
   ```

4. **`ticktick_complete_task`** - Mark a task as complete
   ```typescript
   {
     project_id: string;  // Required: Project ID
     task_id: string;     // Required: Task ID
   }
   ```

5. **`ticktick_delete_task`** - Delete a task
   ```typescript
   {
     project_id: string;  // Required: Project ID
     task_id: string;     // Required: Task ID
   }
   ```

### Project Management

1. **`ticktick_get_projects`** - Get a list of all projects

2. **`ticktick_create_project`** - Create a new project
   ```typescript
   {
     name: string;        // Required: Project name
     color?: string;      // Optional: Color code (e.g. "#F18181")
     view_mode?: string;  // Optional: View mode ("list", "kanban", "timeline")
     kind?: string;       // Optional: Project kind ("TASK", "NOTE")
   }
   ```

## 📁 Project Structure

```
ticktick-mcpserver/
├── dist/                     # Compiled TypeScript (generated after building)
├── src/
│   └── index.ts              # Main server implementation
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 API Reference

This project uses the [TickTick Open API](https://developer.ticktick.com/docs#/openapi). For detailed information about API endpoints and parameters, please refer to the official documentation.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [TickTick](https://ticktick.com/) for providing the API
- [Model Context Protocol (MCP)](https://github.com/anthropics/model-context-protocol-spec) for the protocol specification