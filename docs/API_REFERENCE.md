# API Reference

This document provides detailed information about the tools available in the TickTick MCP Server and how to use them.

## Task Management Tools

### `ticktick_get_tasks`

Retrieves tasks from TickTick, either from a specific project or from all projects.

**Input Schema:**
```typescript
{
  project_id?: string; // Optional - Filter tasks by project ID
  limit?: number;      // Optional - Maximum number of tasks to return (default: 10)
}
```

**Example:**
```json
{
  "project_id": "6226ff9877acee87727f6bca",
  "limit": 5
}
```

**Response:**
A formatted list of tasks with their details:
```
- Task Title
  Content: Task content
  Description: Task description
  Due: 2025-04-30T09:00:00+0000
  Priority: 3
```

### `ticktick_create_task`

Creates a new task in TickTick.

**Input Schema:**
```typescript
{
  title: string;       // Required - The title of the task
  content?: string;    // Optional - Task content or details
  desc?: string;       // Optional - Task description
  project_id: string;  // Required - Project ID where the task should be created
  due_date?: string;   // Optional - Due date in ISO format 'YYYY-MM-DDThh:mm:ssZ'
  priority?: number;   // Optional - Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High)
  is_all_day?: boolean; // Optional - Whether the task is an all-day task
}
```

**Example:**
```json
{
  "title": "Complete quarterly report",
  "content": "Finish the Q1 sales report for management review",
  "project_id": "6226ff9877acee87727f6bca",
  "due_date": "2025-04-15T17:00:00+0000",
  "priority": 3,
  "is_all_day": false
}
```

**Response:**
Confirmation message with the created task details.

### `ticktick_update_task`

Updates an existing task in TickTick.

**Input Schema:**
```typescript
{
  project_id: string;  // Required - Project ID of the task
  task_id: string;     // Required - ID of the task to update
  title?: string;      // Optional - New title for the task
  content?: string;    // Optional - New content for the task
  desc?: string;       // Optional - New description for the task
  due_date?: string;   // Optional - New due date in ISO format
  priority?: number;   // Optional - New priority level
  is_all_day?: boolean; // Optional - New all-day flag
}
```

**Example:**
```json
{
  "project_id": "6226ff9877acee87727f6bca",
  "task_id": "63b7bebb91c0a5474805fcd4",
  "priority": 5,
  "due_date": "2025-04-16T09:00:00+0000"
}
```

**Response:**
Confirmation message with the updated task details.

### `ticktick_complete_task`

Marks a task as complete.

**Input Schema:**
```typescript
{
  project_id: string;  // Required - Project ID of the task
  task_id: string;     // Required - ID of the task to mark as complete
}
```

**Example:**
```json
{
  "project_id": "6226ff9877acee87727f6bca",
  "task_id": "63b7bebb91c0a5474805fcd4"
}
```

**Response:**
Confirmation message that the task was completed.

### `ticktick_delete_task`

Deletes a task from TickTick.

**Input Schema:**
```typescript
{
  project_id: string;  // Required - Project ID of the task
  task_id: string;     // Required - ID of the task to delete
}
```

**Example:**
```json
{
  "project_id": "6226ff9877acee87727f6bca",
  "task_id": "63b7bebb91c0a5474805fcd4"
}
```

**Response:**
Confirmation message that the task was deleted.

## Project Management Tools

### `ticktick_get_projects`

Retrieves a list of all projects in TickTick.

**Input Schema:**
```typescript
{} // No parameters required
```

**Response:**
A formatted list of projects with their details:
```
- Project Name (ID: 6226ff9877acee87727f6bca)
  Color: #F18181
  View Mode: list
  Kind: TASK
```

### `ticktick_create_project`

Creates a new project in TickTick.

**Input Schema:**
```typescript
{
  name: string;        // Required - Project name
  color?: string;      // Optional - Color code (e.g. "#F18181")
  view_mode?: string;  // Optional - View mode: "list", "kanban", "timeline"
  kind?: string;       // Optional - Project kind: "TASK" or "NOTE"
}
```

**Example:**
```json
{
  "name": "Q2 Planning",
  "color": "#58C9B9",
  "view_mode": "kanban",
  "kind": "TASK"
}
```

**Response:**
Confirmation message with the created project details.

## Error Handling

All tools return appropriate error messages when something goes wrong. Common error scenarios include:

1. **Authentication errors**: If the access token is invalid or expired
2. **Not found errors**: If a project or task ID doesn't exist
3. **Permission errors**: If the authenticated user doesn't have access to a resource
4. **Validation errors**: If the input parameters don't meet the required format

Error responses include a descriptive message to help debug the issue.

## TickTick API Reference

This MCP server is built on top of the [TickTick Open API](https://developer.ticktick.com/docs#/openapi). For more detailed information about the underlying API endpoints and response formats, please refer to the official documentation.

## Rate Limits

Be aware that the TickTick API has rate limits. While this MCP server doesn't implement rate limiting itself, excessive API calls might be throttled by TickTick's servers. Please implement appropriate rate limiting in your application if you expect high usage.

## Authentication

All calls to the TickTick API require authentication. This MCP server uses the access token provided in the `TICKTICK_ACCESS_TOKEN` environment variable. Make sure this token has the necessary scopes (`tasks:read`, `tasks:write`) and is kept up to date.