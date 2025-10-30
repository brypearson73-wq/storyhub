# StoryHub

**A comprehensive newsroom content management system for coordinating stories, assets, and coverage across multiple desks.**

---

## 📋 Project Overview

StoryHub is designed for newsroom operations, enabling teams to:
- Track Stories, Assets, Storylines, and Events
- Coordinate across multiple desks (Politics, Business, National, International, Health, Sports, etc.)
- Manage editorial workflows with TRIAD/Legal review
- Plan and schedule streaming content
- Collaborate in real-time with notes and tagging

### Key Users
- Reporters and Editors
- Desk Chiefs
- Global Planning Team
- Streaming/Programming Team
- Legal/TRIAD Review Team

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Backend)
- Python 3.11+ (Backend alternative) OR
- PostgreSQL 14+ (Database)
- npm or yarn (Frontend package management)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/storyhub.git
cd storyhub

# Install dependencies (adjust based on final tech stack)
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
storyhub/
├── docs/                    # Documentation
│   ├── BACKLOG.md          # Complete product backlog
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DATABASE_SCHEMA.md  # Database design
│   └── API_SPEC.md         # API documentation
├── src/                     # Source code
│   ├── backend/            # Backend API
│   ├── frontend/           # Frontend application
│   └── shared/             # Shared types/utilities
├── tests/                   # Test files
├── scripts/                 # Build/deployment scripts
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🎯 Current Status

**Version:** 0.1.0  
**Status:** Project Setup  
**Last Updated:** October 30, 2025

### Completed
- ✅ Product backlog definition
- ✅ Project structure setup

### In Progress
- 🔄 Technical architecture definition
- 🔄 Database schema design

### Next Steps
1. Define tech stack (backend framework, frontend framework)
2. Design database schema for core entities
3. Set up development environment
4. Build MVP Phase 1A features

---

## 📚 Documentation

- **[Product Backlog](docs/BACKLOG.md)** - Complete feature list organized by priority
- **[Architecture](docs/ARCHITECTURE.md)** - System design and technical decisions *(coming soon)*
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Data model and relationships *(coming soon)*
- **[API Specification](docs/API_SPEC.md)** - REST API endpoints *(coming soon)*

---

## 🛠️ Tech Stack

**To Be Decided:**
- Backend Framework: FastAPI (Python) or Express (Node.js)
- Frontend Framework: React or Vue
- Database: PostgreSQL
- Authentication: JWT or OAuth
- Real-time: WebSockets or Server-Sent Events
- Deployment: Docker + Kubernetes or similar

---

## 🤝 Development Workflow

### Working with Claude

This project is designed to work seamlessly with Claude AI assistance:

1. **Context Files**: Key documents are in `/docs` for easy reference
2. **Backlog**: Always up-to-date in `docs/BACKLOG.md`
3. **Architecture Decisions**: Documented as they're made
4. **Code Standards**: Will be defined in CONTRIBUTING.md

### Starting a New Conversation

To continue development in a new Claude conversation:

```
I'm working on StoryHub, a newsroom content management system.

Key docs:
- Backlog: [link to BACKLOG.md in your repo]
- Architecture: [link to ARCHITECTURE.md]

I want to work on: [describe your task]
```

---

## 📊 MVP Roadmap

### Phase 1A - Core Functionality
**Target:** Sprints 1-2
- Story entity
- Asset entity  
- Freeform Notes
- Tags system
- Daily View per Desk

### Phase 1B - Essential Features
**Target:** Sprints 3-4
- Storyline entity
- Events entity
- Story-Asset Linking
- Legal/TRIAD Flag
- Desks Awareness Tag

### Phase 1C - MVP Complete
**Target:** Sprints 5-6
- Reporting Guidance entity
- Links/Attachments
- Streaming Calendar

---

## 🧪 Testing

*(To be defined)*

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 🚢 Deployment

*(To be defined)*

---

## 📝 License

*(To be defined)*

---

## 👥 Team

*(To be defined)*

---

## 🆘 Support

For questions or issues:
- Review documentation in `/docs`
- Check the backlog for feature status
- *(Add issue tracker link when available)*

---

## 🗺️ Integrations

### Stellar System
StoryHub integrates with the Stellar content management system:
- Story content links to Stellar leaves
- Asset publication links to Stellar components
- Branding metadata derived from Stellar

### Future Integrations
- CNN Guest Book (for Outreach Requests)
- DART Team dashboards (for Ratings & Engagement)

---

**Built for newsroom teams who need powerful coordination tools.**
