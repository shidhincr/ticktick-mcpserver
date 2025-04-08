/**
 * Basic usage example for the TickTick MCP Server
 * 
 * This example demonstrates how to programmatically interact with the MCP server
 * to perform basic task management operations.
 * 
 * Prerequisites:
 * 1. Start the TickTick MCP Server
 * 2. Set the TICKTICK_ACCESS_TOKEN environment variable
 */

const { spawn } = require('child_process');
const path = require('path');

// Path to the MCP server binary
const MCP_SERVER_PATH = path.join(__dirname, '..', 'dist', 'index.js');

// Start the MCP server process
const mcpServer = spawn('node', [MCP_SERVER_PATH], {
  env: {
    ...process.env,
    // Make sure TICKTICK_ACCESS_TOKEN is set in your environment
  }
});

// Helper function to send a request to the MCP server
function sendRequest(request) {
  return new Promise((resolve, reject) => {
    const jsonRequest = JSON.stringify(request) + '\n';
    mcpServer.stdin.write(jsonRequest);
    
    mcpServer.stdout.once('data', (data) => {
      try {
        const response = JSON.parse(data.toString());
        resolve(response);
      } catch (error) {
        reject(new Error(`Failed to parse response: ${error.message}`));
      }
    });
  });
}

// Example workflow
async function runExample() {
  try {
    console.log('1. Listing available tools...');
    const toolsRequest = {
      id: '1',
      jsonrpc: '2.0',
      method: 'list_tools',
      params: {}
    };
    const toolsResponse = await sendRequest(toolsRequest);
    console.log('Available tools:', toolsResponse.result.tools.map(tool => tool.name));
    
    // Get projects
    console.log('\n2. Getting projects...');
    const projectsRequest = {
      id: '2',
      jsonrpc: '2.0',
      method: 'call_tool',
      params: {
        name: 'ticktick_get_projects',
        arguments: {}
      }
    };
    const projectsResponse = await sendRequest(projectsRequest);
    console.log('Projects response:', projectsResponse.result.content[0].text);
    
    // Extract a project ID from the response (this is a simple example extraction)
    // In a real-world application, you'd want to parse this properly
    const projectsText = projectsResponse.result.content[0].text;
    const projectIdMatch = projectsText.match(/ID: ([a-f0-9]+)/);
    if (!projectIdMatch) {
      throw new Error('Could not extract project ID from response');
    }
    const projectId = projectIdMatch[1];
    console.log(`Using project ID: ${projectId}`);
    
    // Create a task
    console.log('\n3. Creating a task...');
    const createTaskRequest = {
      id: '3',
      jsonrpc: '2.0',
      method: 'call_tool',
      params: {
        name: 'ticktick_create_task',
        arguments: {
          title: 'Example task created via MCP',
          content: 'This task was created using the TickTick MCP Server example',
          project_id: projectId,
          priority: 3,
          due_date: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        }
      }
    };
    const createTaskResponse = await sendRequest(createTaskRequest);
    console.log('Task created:', createTaskResponse.result.content[0].text);
    
    // Extract task ID (again, in a real app you'd parse this more robustly)
    const taskIdMatch = createTaskResponse.result.content[0].text.match(/ID: ([a-f0-9]+)/);
    const taskId = taskIdMatch ? taskIdMatch[1] : null;
    
    if (taskId) {
      // Get tasks in the project
      console.log('\n4. Getting tasks from the project...');
      const getTasksRequest = {
        id: '4',
        jsonrpc: '2.0',
        method: 'call_tool',
        params: {
          name: 'ticktick_get_tasks',
          arguments: {
            project_id: projectId
          }
        }
      };
      const getTasksResponse = await sendRequest(getTasksRequest);
      console.log('Tasks in project:', getTasksResponse.result.content[0].text);
      
      // Complete the task
      console.log('\n5. Completing the task...');
      const completeTaskRequest = {
        id: '5',
        jsonrpc: '2.0',
        method: 'call_tool',
        params: {
          name: 'ticktick_complete_task',
          arguments: {
            project_id: projectId,
            task_id: taskId
          }
        }
      };
      const completeTaskResponse = await sendRequest(completeTaskRequest);
      console.log('Task completion result:', completeTaskResponse.result.content[0].text);
    }
  } catch (error) {
    console.error('Error during example execution:', error);
  } finally {
    // Close the MCP server
    mcpServer.stdin.end();
    mcpServer.kill();
    console.log('\nExample completed.');
  }
}

runExample();
