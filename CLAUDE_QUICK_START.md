# Quick Start Template for Claude Conversations

Use this template when starting a new Claude conversation to maintain context and avoid repetition.

---

## 🎯 Standard Opening Message

Copy and paste this (update the GitHub username):

```
I'm working on StoryHub, a newsroom content management system.

Here are the key documents:

📋 Product Backlog: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/BACKLOG.md
🔄 Development Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md
📖 Project README: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/README.md

Current status: [Project Setup / In Development / etc]

I want to work on: [DESCRIBE YOUR SPECIFIC TASK]
```

---

## 📝 Task-Specific Templates

### For Architecture Decisions

```
I'm working on StoryHub architecture decisions.

Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md
Backlog: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/BACKLOG.md

I need help deciding:
1. [Specific decision point]
2. [Trade-offs to consider]

My constraints are:
- [List any constraints]
```

### For Database Schema Design

```
I'm designing the StoryHub database schema.

Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md
Backlog: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/BACKLOG.md

Focus on entities: [Story / Asset / Storyline / etc]

Requirements:
- [List specific requirements]
```

### For API Development

```
I'm building StoryHub API endpoints.

Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md
API Spec: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/API_SPEC.md

Working on: [GET /stories / POST /assets / etc]

Current code: [paste relevant code or link to file]
```

### For Frontend Components

```
I'm building StoryHub frontend components.

Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md
Backlog: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/BACKLOG.md

Component: [Story List / Asset Card / Daily View / etc]

Requirements from backlog: [reference specific feature]
```

### For Bug Fixes

```
I'm fixing a bug in StoryHub.

Context: https://github.com/[YOUR-USERNAME]/storyhub/blob/main/docs/CONTEXT.md

Bug description:
- What's broken: [describe issue]
- Expected behavior: [what should happen]
- Actual behavior: [what actually happens]
- Code location: [file and line number or link]

Current code: [paste or link]
```

---

## 🔄 After Each Session

1. **Update CONTEXT.md** with:
   - What was completed
   - What decisions were made
   - What's next

2. **Update BACKLOG.md** with:
   - Feature status changes
   - New insights or requirements

3. **Commit changes:**
   ```bash
   git add docs/CONTEXT.md docs/BACKLOG.md
   git commit -m "Update context: [what changed]"
   git push
   ```

4. **Note for next session:**
   Save a quick note about where you left off so you know what to work on next.

---

## 💡 Pro Tips

### Minimize Context Loss
- Always link to GitHub files (not paste contents)
- Use raw GitHub URLs for code files
- Keep CONTEXT.md updated
- Reference specific backlog items by number/name

### Efficient Collaboration
- Be specific about what you need
- Provide relevant code/files upfront
- State your constraints clearly
- Mention what you've already tried

### Managing Conversation Limits
- Break large tasks into smaller focused sessions
- Complete one feature/component per conversation
- Update docs immediately after each session
- Use the templates above for quick context

---

## 📋 Session Checklist

Before ending a Claude conversation:

- [ ] Update CONTEXT.md with progress
- [ ] Update BACKLOG.md feature status
- [ ] Commit and push changes
- [ ] Note what to work on next
- [ ] Save any important code snippets/decisions

---

## 🎪 Example Real Session

Here's what an actual conversation might look like:

```
I'm working on StoryHub, a newsroom content management system.

Context: https://github.com/brypearson73-wq/storyhub/blob/main/docs/CONTEXT.md
Backlog: https://github.com/brypearson73-wq/storyhub/blob/main/docs/BACKLOG.md

We've decided on:
- Backend: FastAPI (Python)
- Frontend: React
- Database: PostgreSQL

I want to design the database schema for the Story entity from the backlog.
The Story entity needs to track:
- Headlines, descriptions
- Story owners (reporters/editors with roles)
- Desk/Section assignments
- Publish dates and status
- Links to Stellar content
- Embargo times
- Sponsorship info

Can you help me create the PostgreSQL table definitions and SQLAlchemy models?
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ Don't paste entire files - link to them on GitHub
2. ❌ Don't forget to update CONTEXT.md after sessions
3. ❌ Don't start conversations with "continue from where we left off" (be specific)
4. ❌ Don't work on multiple unrelated features in one conversation
5. ❌ Don't forget to commit documentation updates

---

## 📚 Quick Links Reference

Update these with your actual GitHub username:

- Project Root: `https://github.com/[USERNAME]/storyhub`
- Backlog: `https://github.com/[USERNAME]/storyhub/blob/main/docs/BACKLOG.md`
- Context: `https://github.com/[USERNAME]/storyhub/blob/main/docs/CONTEXT.md`
- README: `https://github.com/[USERNAME]/storyhub/blob/main/README.md`
- Setup Guide: `https://github.com/[USERNAME]/storyhub/blob/main/SETUP.md`

---

**Save this file to your local machine for quick reference!**
