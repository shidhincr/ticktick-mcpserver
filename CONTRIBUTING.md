# Contributing to TickTick MCP Server

First off, thank you for considering contributing to TickTick MCP Server! It's people like you that make this project better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Be patient with other community members
- Constructive criticism is welcome, but be kind and courteous 
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots or animated GIFs** if possible.
- **If you're reporting a server crash**, include a stack trace if available.
- **Include the Node.js version** you're using.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps** or point to similar projects where this enhancement exists.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most users.

### Pull Requests

- **Fill in the required template**
- **Do not include issue numbers in the PR title**
- **Include screenshots and animated GIFs in your pull request whenever possible**
- **Follow the TypeScript coding style**
- **Document new code**
- **Run tests** if available before submitting
- **Include thoughtful commit messages**

## Development Workflow

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Add/update tests if applicable
5. Ensure code is properly formatted
6. Push to your fork
7. Submit a pull request

### Setting Up Development Environment

1. Install Node.js 18 or higher
2. Clone your fork:
   ```
   git clone https://github.com/YOUR_USERNAME/ticktick-mcpserver.git
   cd ticktick-mcpserver
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` (if available)
5. Build the project:
   ```
   npm run build
   ```
6. Start the development server:
   ```
   npm run dev
   ```

## Style Guidelines

### Code Style

We use ESLint and Prettier to maintain code quality. Please make sure your code follows our style by running:

```
npm run lint
```

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - ✨ `:sparkles:` when adding a new feature
  - 🐛 `:bug:` when fixing a bug
  - 📚 `:books:` when adding or updating documentation
  - ♻️ `:recycle:` when refactoring code
  - 🧪 `:test_tube:` when adding tests
  - 🎨 `:art:` when improving the format/structure of the code

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that are bugs
- `documentation` - Issues or PRs related to documentation
- `enhancement` - Issues that are feature requests or PRs that implement enhancements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.
