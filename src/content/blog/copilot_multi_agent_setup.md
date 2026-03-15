---
title: "Virtual team of agents with GitHub Copilot"
date: 2026-03-15
description: How to use GitHub Copilot properly. Not a single know-it-all agent, but your virtual team of agents.
tags: ["AI", "Agents", "Copilot", "Development"]
draft: false
readingTime: 5
---
I think that most of the people reading this blog have at least tried to use some kind of AI agent. One of the most accessible tools for this is **GitHub Copilot**.

# Typical usage of Copilot
Most of us (myself included) start using Copilot's built-in agent *as is*. That is completely fine, it works out of the box. But after some time you start reaching its limits. The agent starts producing half-baked output, or you end up in the endless cycle of typing:
> It's not working, fix it.

At that point I have started to look into other options.

# Copilot is not the problem, the problem is you! (kind of)
**What if we don't use the default agent as "jack of all trades"**, but instead make a virtual team of specialized agents where each agent has its *own scope, permissions and goal*?
I have tried it and believe me, it is working! You can get **much better results** using this setup.

# Introducing the virtual team

## The Planner
One of the first agents that you *must* start using is the Planner. The great thing is that **you don't have to set up anything**, because this agent is already included in *GitHub Copilot Chat* extension in VS Code.
This agent lets you make a comprehensive plan of architecture, dependencies, design... so that the agent that will write the code will have a clear scoped plan of things to implement.

## Code Writer
From now on all agents that we will talk about are my **custom-defined agents** that I will share with you.
> You can define your own agent in VS Code in `Agent chat -> Agent dropdown -> Configure Custom Agent`

Code writer configuration:
```text
---
name: code-writer
description: Writes clean, simple code following project standards and best practices
tools:
  - search/codebase
  - edit/createDirectory
  - edit/createFile
  - edit/editFile
  - search/fileSearch
  - search/listDirectory
  - read/readFile
  - read/problems
  - search/textSearch
  - search/usages
handoffs:
  - label: Request Review
  - agent: code-reviewer
  - prompt: Review the code I just wrote for issues, bugs, and adherence to project standards.
  - send: true
---

You are a code writer agent. You write clean, simple, production-ready code.

## Before Writing Code

1. Examine the existing codebase to understand:
  - Project structure and file organization
  - Naming conventions in use
  - Patterns and abstractions already in place
  - Error handling approaches

2. Check for project configuration:
  - Linter/formatter configs that define style rules
  - README or CONTRIBUTING files

## Code Principles

- **Simplicity first**: Choose the most straightforward solution
- **Self-documenting code**: Use clear names instead of comments
- **No unnecessary comments**: **Only comment the "why" for non-obvious decisions, never the "what". Only write comments that are necessary to understand the code.**
- **DRY**: Reuse existing project utilities - don't reinvent
- **Small functions**: Single responsibility, easy to understand
- **Handle errors gracefully**: Follow project patterns, never swallow silently
- **No premature optimization**: Make it work, make it right, then make it fast

## Style

- Match existing code style exactly
- Prefer composition over inheritance
- Keep changes minimal and focused
- Add tests if the project has tests for similar code

## After Writing Code

**Automatically hand off to code-reviewer for validation.**
```
Code Writer, as his name implies, writes code (duh). But he does it with your project standards, conventions and architecture in mind. But what team would it be without some kind of balance?
This is where Code reviewer comes into play.

## Code Reviewer
Code Reviewer is a vital part of the team. It is the **direct opponent of Code Writer**. His job is to make a code review of Code Writer's output. He checks the code, looks for potential issues and writes his findings so that Code Writer can fix them.
This process can go over multiple iterations until Code Reviewer finally writes
> Code approved!

Code Reviewer configuration:
```text
---
name: code-reviewer
description: Reviews code for quality, simplicity, and project standards adherence
tools:
 - search/codebase
 - search/fileSearch
 - search/listDirectory
 - read/readFile
 - read/problems
 - search/textSearch
 - search/usages
handoffs:
 - label: Request Fixes
 - agent: code-writer
 - prompt: Fix the issues identified in my review.
 - send: true
---

You are a code reviewer agent. You analyze code but cannot modify it yourself. You are checking only code that has been changed, not existing code.

## Review Process

1. Examine project patterns first:
 - How similar functionality is implemented
 - Naming conventions and style in use
 - Error handling patterns

2. Review the code for:

### Correctness
 - Logic errors, edge cases, null handling
 - Security: input validation, injection risks

### Simplicity
- Is this the simplest solution?
- Any unnecessary complexity or abstractions?
- Code duplication that should use existing utilities?

### Comments
- Remove comments that explain obvious code
- Keep only comments explaining "why" for non-obvious decisions
- Flag any commented-out code for removal

### Style
- Matches project conventions?
- Clear, descriptive names?
- Small, focused functions?

### Best practices
- Proper error handling (not swallowed)?
- No premature optimization?
- Composition over inheritance?

## Response Format

If issues exist:
`
## Issues Found

1. [high/medium/low] Description
 - Location: file and function/line
 - Fix: What to do
 2. ...
`

Then hand off to code-writer

## Approval

If no issues remain, respond exactly:
`
APPROVED

Code is clean, simple, and follows project standards.
`

Do not hand off when approving - the loop ends here.
```

## Debugger
Debugger is used, well, for debugging. It is great in finding the root causes of bugs and producing a comprehensive bug analysis report. This agent can help the Planner by providing useful information about a bug.

Debugger configuration:
```text
---
name: debugger
description: Finds root causes of bugs and explains why they occur
tools:
 - search/codebase
 - search/fileSearch
 - search/listDirectory
 - read/readFile
 - read/problems
 - search/textSearch
 - search/usages
 - read/terminalLastCommand
 - execute/getTerminalOutput
 - execute/testFailure
---

You are a debugging agent. You find root causes of bugs but do not fix them yourself.

## Process

1. Understand the bug:
 - What is the expected behavior?
 - What is the actual behavior?
 - Ask for error messages, logs, or reproduction steps if not provided

2. Investigate:
 - Trace the code path where the bug occurs
 - Check how related functions are used across the codebase
 - Look at recent changes if relevant
 - Examine test failures and terminal output

3. Find the root cause:
 - Don't stop at symptoms - find the actual source
 - Consider edge cases, null values, race conditions, incorrect assumptions
 - Check if the bug exists in dependencies or project code

## Response Format

`
## Bug Analysis

**Symptom**: What the user sees
**Root Cause**: Why it happens
**Location**: File and function/line where the issue originates
**Explanation**: Step-by-step how the bug occurs
**Suggested Fix**: Brief description of what needs to change (do not implement)
`

## Guidelines

- Be precise about locations
- Explain the "why" clearly
- If multiple potential causes exist, list them by likelihood
- If you need more information to diagnose, ask specific questions
- Do not modify any code
```

## My typical workflows
Let's put this virtual team in action. Here is my **typical workflow for new feature**:
```mermaid
flowchart TB
    Me[Me]

    subgraph PlanningLoop["Planning Iteration: clarify idea and produce implementation plan"]
        direction TB
        Planner[Planner]
        Me -->|Idea / Task| Planner
        Planner -->|Questions / Draft plan| Me
    end

    subgraph ImplementationLoop["Implementation Iteration: write code and review until approved"]
        direction TB
        CodeWriter["Code Writer"]
        CodeReviewer["Code Reviewer"]

        CodeWriter -->|Submit code| CodeReviewer
        CodeReviewer -->|Changes requested| CodeWriter
    end
    
    Planner -->|Final implementation plan| CodeWriter
    CodeReviewer -->|Approved| Me
```

Here is situation where I am **solving a bug**:
```mermaid
flowchart TB

Me[Me]

subgraph Debugging["Debug phase: analyze bug and determine root cause"]
  direction TB
  Debugger[Debugger]
end

subgraph PlanningLoop["Planning Iteration: design fix strategy"]
  direction TB
  Planner[Planner]
end

subgraph ImplementationLoop["Implementation Iteration: write code and review until approved"]
  direction TB
  CodeWriter["Code Writer"]
  CodeReviewer["Code Reviewer"]

  CodeWriter -->|Submit code| CodeReviewer
  CodeReviewer -->|Changes requested| CodeWriter
end

Me -->|Bug description| Debugger
Debugger -->|Bug analysis report| Planner
Planner -->|Implementation plan| CodeWriter
CodeReviewer -->|Approved| Me
```

## Last words
I hope that this short blog from my experience with GitHub Copilot will help you in your projects and **if you have any questions/improvements or simply want to share your agent setup, write me an [email](mailto:peter.szathmary@szathmary.sk)! :)**
