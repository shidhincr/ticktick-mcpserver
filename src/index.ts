#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// TickTick API base URL
const TICKTICK_API_BASE_URL = "https://api.ticktick.com/open/v1";

// Define tools
const GET_TASKS_TOOL: Tool = {
  name: "ticktick_get_tasks",
  description: "Get a list of tasks from a specific project or all projects",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Filter tasks by project ID (optional)",
      },
      limit: {
        type: "number",
        description: "Maximum number of tasks to return (optional)",
        default: 10,
      },
    },
  },
};

const CREATE_TASK_TOOL: Tool = {
  name: "ticktick_create_task",
  description: "Create a new task in TickTick with optional description, due date, and priority",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the task",
      },
      content: {
        type: "string",
        description: "Content or details of the task (optional)",
      },
      desc: {
        type: "string",
        description: "Description of the task (optional)",
      },
      project_id: {
        type: "string",
        description: "Project ID where task should be created",
      },
      due_date: {
        type: "string",
        description: "Due date in ISO format 'YYYY-MM-DDThh:mm:ssZ' (optional)",
      },
      priority: {
        type: "number",
        description: "Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High) (optional)",
        enum: [0, 1, 3, 5],
      },
      is_all_day: {
        type: "boolean",
        description: "Whether the task is an all-day task (optional)",
      },
    },
    required: ["title", "project_id"],
  },
};

const UPDATE_TASK_TOOL: Tool = {
  name: "ticktick_update_task",
  description: "Update an existing task in TickTick",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Project ID of the task",
      },
      task_id: {
        type: "string",
        description: "ID of the task to update",
      },
      title: {
        type: "string",
        description: "New title for the task (optional)",
      },
      content: {
        type: "string",
        description: "New content for the task (optional)",
      },
      desc: {
        type: "string",
        description: "New description for the task (optional)",
      },
      due_date: {
        type: "string",
        description: "New due date in ISO format 'YYYY-MM-DDThh:mm:ssZ' (optional)",
      },
      priority: {
        type: "number",
        description: "Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High) (optional)",
        enum: [0, 1, 3, 5],
      },
      is_all_day: {
        type: "boolean",
        description: "Whether the task is an all-day task (optional)",
      },
    },
    required: ["project_id", "task_id"],
  },
};

const COMPLETE_TASK_TOOL: Tool = {
  name: "ticktick_complete_task",
  description: "Mark a task as complete",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Project ID of the task",
      },
      task_id: {
        type: "string",
        description: "ID of the task to mark as complete",
      },
    },
    required: ["project_id", "task_id"],
  },
};

const DELETE_TASK_TOOL: Tool = {
  name: "ticktick_delete_task",
  description: "Delete a task from TickTick",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Project ID of the task",
      },
      task_id: {
        type: "string",
        description: "ID of the task to delete",
      },
    },
    required: ["project_id", "task_id"],
  },
};

const GET_PROJECTS_TOOL: Tool = {
  name: "ticktick_get_projects",
  description: "Get a list of all projects in TickTick",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const CREATE_PROJECT_TOOL: Tool = {
  name: "ticktick_create_project",
  description: "Create a new project in TickTick",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the project",
      },
      color: {
        type: "string",
        description: "Color code for the project (e.g., '#F18181') (optional)",
      },
      view_mode: {
        type: "string",
        description: "View mode: 'list', 'kanban', 'timeline' (optional)",
        enum: ["list", "kanban", "timeline"],
        default: "list",
      },
      kind: {
        type: "string",
        description: "Kind of project: 'TASK' or 'NOTE' (optional)",
        enum: ["TASK", "NOTE"],
        default: "TASK",
      },
    },
    required: ["name"],
  },
};

// Server implementation
const server = new Server(
  {
    name: "ticktick-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Check for API token
const TICKTICK_ACCESS_TOKEN = process.env.TICKTICK_ACCESS_TOKEN;
if (!TICKTICK_ACCESS_TOKEN) {
  console.error("Error: TICKTICK_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

// Headers for API requests
const getHeaders = () => {
  return {
    Authorization: `Bearer ${TICKTICK_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
};

// Type guards for arguments
function isGetTasksArgs(args: unknown): args is {
  project_id?: string;
  limit?: number;
} {
  return typeof args === "object" && args !== null;
}

function isCreateTaskArgs(args: unknown): args is {
  title: string;
  content?: string;
  desc?: string;
  project_id: string;
  due_date?: string;
  priority?: number;
  is_all_day?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "title" in args &&
    typeof (args as { title: string }).title === "string" &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string"
  );
}

function isUpdateTaskArgs(args: unknown): args is {
  project_id: string;
  task_id: string;
  title?: string;
  content?: string;
  desc?: string;
  due_date?: string;
  priority?: number;
  is_all_day?: boolean;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string" &&
    "task_id" in args &&
    typeof (args as { task_id: string }).task_id === "string"
  );
}

function isCompleteTaskArgs(args: unknown): args is {
  project_id: string;
  task_id: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string" &&
    "task_id" in args &&
    typeof (args as { task_id: string }).task_id === "string"
  );
}

function isDeleteTaskArgs(args: unknown): args is {
  project_id: string;
  task_id: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "project_id" in args &&
    typeof (args as { project_id: string }).project_id === "string" &&
    "task_id" in args &&
    typeof (args as { task_id: string }).task_id === "string"
  );
}

function isGetProjectsArgs(args: unknown): args is {} {
  return typeof args === "object" && args !== null;
}

function isCreateProjectArgs(args: unknown): args is {
  name: string;
  color?: string;
  view_mode?: "list" | "kanban" | "timeline";
  kind?: "TASK" | "NOTE";
} {
  return (
    typeof args === "object" &&
    args !== null &&
    "name" in args &&
    typeof (args as { name: string }).name === "string"
  );
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    GET_TASKS_TOOL,
    CREATE_TASK_TOOL,
    UPDATE_TASK_TOOL,
    COMPLETE_TASK_TOOL,
    DELETE_TASK_TOOL,
    GET_PROJECTS_TOOL,
    CREATE_PROJECT_TOOL,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    if (!args) {
      throw new Error("No arguments provided");
    }

    // Get tasks
    if (name === "ticktick_get_tasks") {
      if (!isGetTasksArgs(args)) {
        throw new Error("Invalid arguments for ticktick_get_tasks");
      }

      let tasks = [];
      
      if (args.project_id) {
        // Get tasks from specific project
        const response = await axios.get(
          `${TICKTICK_API_BASE_URL}/project/${args.project_id}/data`,
          { headers: getHeaders() }
        );
        tasks = response.data.tasks || [];
      } else {
        // Get all projects first
        const projectsResponse = await axios.get(
          `${TICKTICK_API_BASE_URL}/project`,
          { headers: getHeaders() }
        );
        
        // Collect tasks from all projects
        const allTasks = [];
        for (const project of projectsResponse.data) {
          try {
            const projectData = await axios.get(
              `${TICKTICK_API_BASE_URL}/project/${project.id}/data`,
              { headers: getHeaders() }
            );
            if (projectData.data.tasks && projectData.data.tasks.length > 0) {
              allTasks.push(...projectData.data.tasks);
            }
          } catch (error) {
            console.error(`Error fetching tasks for project ${project.id}:`, error);
          }
        }
        tasks = allTasks;
      }

      // Apply limit
      if (args.limit && args.limit > 0 && tasks.length > args.limit) {
        tasks = tasks.slice(0, args.limit);
      }

      // Format tasks for output
      const taskList = tasks.map(task => 
        `- ${task.title}${task.content ? `\n  Content: ${task.content}` : ''}${task.desc ? `\n  Description: ${task.desc}` : ''}${task.dueDate ? `\n  Due: ${task.dueDate}` : ''}${task.priority !== undefined ? `\n  Priority: ${task.priority}` : ''}`
      ).join('\n\n');

      return {
        content: [{
          type: "text",
          text: tasks.length > 0 ? taskList : "No tasks found matching the criteria"
        }],
        isError: false,
      };
    }

    // Create task
    if (name === "ticktick_create_task") {
      if (!isCreateTaskArgs(args)) {
        throw new Error("Invalid arguments for ticktick_create_task");
      }

      const taskData = {
        title: args.title,
        content: args.content,
        desc: args.desc,
        projectId: args.project_id,
        isAllDay: args.is_all_day,
        priority: args.priority,
      };

      if (args.due_date) {
        taskData['dueDate'] = args.due_date;
      }

      // Create task
      const response = await axios.post(
        `${TICKTICK_API_BASE_URL}/task`,
        taskData,
        { headers: getHeaders() }
      );

      const task = response.data;

      return {
        content: [{
          type: "text",
          text: `Task created:\nTitle: ${task.title}${task.content ? `\nContent: ${task.content}` : ''}${task.desc ? `\nDescription: ${task.desc}` : ''}${task.dueDate ? `\nDue: ${task.dueDate}` : ''}${task.priority !== undefined ? `\nPriority: ${task.priority}` : ''}`
        }],
        isError: false,
      };
    }

    // Update task
    if (name === "ticktick_update_task") {
      if (!isUpdateTaskArgs(args)) {
        throw new Error("Invalid arguments for ticktick_update_task");
      }

      // First, get the current task to preserve existing fields
      const getTaskResponse = await axios.get(
        `${TICKTICK_API_BASE_URL}/project/${args.project_id}/task/${args.task_id}`,
        { headers: getHeaders() }
      );

      const currentTask = getTaskResponse.data;
      
      // Prepare update data
      const updateData = {
        id: args.task_id,
        projectId: args.project_id,
        title: args.title !== undefined ? args.title : currentTask.title,
        content: args.content !== undefined ? args.content : currentTask.content,
        desc: args.desc !== undefined ? args.desc : currentTask.desc,
        priority: args.priority !== undefined ? args.priority : currentTask.priority,
        isAllDay: args.is_all_day !== undefined ? args.is_all_day : currentTask.isAllDay,
      };

      if (args.due_date) {
        updateData['dueDate'] = args.due_date;
      } else if (currentTask.dueDate) {
        updateData['dueDate'] = currentTask.dueDate;
      }

      // Update task
      const response = await axios.post(
        `${TICKTICK_API_BASE_URL}/task/${args.task_id}`,
        updateData,
        { headers: getHeaders() }
      );

      const updatedTask = response.data;

      return {
        content: [{
          type: "text",
          text: `Task updated:\nTitle: ${updatedTask.title}${updatedTask.content ? `\nContent: ${updatedTask.content}` : ''}${updatedTask.desc ? `\nDescription: ${updatedTask.desc}` : ''}${updatedTask.dueDate ? `\nDue: ${updatedTask.dueDate}` : ''}${updatedTask.priority !== undefined ? `\nPriority: ${updatedTask.priority}` : ''}`
        }],
        isError: false,
      };
    }

    // Complete task
    if (name === "ticktick_complete_task") {
      if (!isCompleteTaskArgs(args)) {
        throw new Error("Invalid arguments for ticktick_complete_task");
      }

      // Complete task
      await axios.post(
        `${TICKTICK_API_BASE_URL}/project/${args.project_id}/task/${args.task_id}/complete`,
        {},
        { headers: getHeaders() }
      );

      return {
        content: [{
          type: "text",
          text: `Successfully completed task`
        }],
        isError: false,
      };
    }

    // Delete task
    if (name === "ticktick_delete_task") {
      if (!isDeleteTaskArgs(args)) {
        throw new Error("Invalid arguments for ticktick_delete_task");
      }

      // Delete task
      await axios.delete(
        `${TICKTICK_API_BASE_URL}/project/${args.project_id}/task/${args.task_id}`,
        { headers: getHeaders() }
      );

      return {
        content: [{
          type: "text",
          text: `Successfully deleted task`
        }],
        isError: false,
      };
    }

    // Get projects
    if (name === "ticktick_get_projects") {
      if (!isGetProjectsArgs(args)) {
        throw new Error("Invalid arguments for ticktick_get_projects");
      }

      // Get projects
      const response = await axios.get(
        `${TICKTICK_API_BASE_URL}/project`,
        { headers: getHeaders() }
      );

      const projects = response.data;

      // Format projects for output
      const projectList = projects.map(project => 
        `- ${project.name} (ID: ${project.id})${project.color ? `\n  Color: ${project.color}` : ''}${project.viewMode ? `\n  View Mode: ${project.viewMode}` : ''}${project.kind ? `\n  Kind: ${project.kind}` : ''}`
      ).join('\n\n');

      return {
        content: [{
          type: "text",
          text: projects.length > 0 ? projectList : "No projects found"
        }],
        isError: false,
      };
    }

    // Create project
    if (name === "ticktick_create_project") {
      if (!isCreateProjectArgs(args)) {
        throw new Error("Invalid arguments for ticktick_create_project");
      }

      const projectData = {
        name: args.name,
        color: args.color,
        viewMode: args.view_mode,
        kind: args.kind?.toUpperCase() || "TASK",
      };

      // Create project
      const response = await axios.post(
        `${TICKTICK_API_BASE_URL}/project`,
        projectData,
        { headers: getHeaders() }
      );

      const project = response.data;

      return {
        content: [{
          type: "text",
          text: `Project created:\nName: ${project.name} (ID: ${project.id})${project.color ? `\nColor: ${project.color}` : ''}${project.viewMode ? `\nView Mode: ${project.viewMode}` : ''}${project.kind ? `\nKind: ${project.kind}` : ''}`
        }],
        isError: false,
      };
    }

    return {
      content: [{
        type: "text",
        text: `Unknown tool: ${name}`
      }],
      isError: true,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TickTick MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
