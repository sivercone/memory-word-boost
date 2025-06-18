# Memory Word Boost

Minimalistic flashcard-based learning web tool.

This project serves as a prototype for a [subsequent project](https://qsets.sivercone.com/).

## Development Philosophy

Outlines of key principles and practices I follow in this application to maintain code quality, consistency, and ease of collaboration.

### Code Style

- **Language:** TypeScript
- **Package Manager:** [Yarn](https://yarnpkg.com/)
- **Linter:** [ESLint](https://eslint.org/) for code consistency
- **Formatter:** [Prettier](https://prettier.io/) for code formatting
- **Naming Conventions:**
  - Folders: `kebab-case`
  - Files, variables and functions: `camelCase`
  - Components: `PascalCase`

### Core Principles

- **Clarity and Simplicity:** Code should be easy to read and understand. Prioritize simplicity over clever solutions.
- Components should follow the **Single Responsibility Principle (SRP):** Each component should do one thing well.
- **Reusability:** Strive to create reusable components and utilities to avoid duplication and improve maintainability.
- **Consistency:** Follow consistent coding patterns, naming conventions, and folder structures.

### Project Structure

I follow a structured approach to organize files and directories:

```
src
├── lib                 # Collection of tools and data
│   ├── hooks           # Custom React hooks
│   └── utils           # Utility functions and helpers
├── modules             # Screen-level components
├── pages               # File-based routing components
├── stores              # Global state management
├── types               # TypeScript types and interfaces
└── ui                  # Reusable React components
```

## License

MIT
