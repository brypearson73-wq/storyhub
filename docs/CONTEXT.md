# StoryHub - Claude Development Context

**Last Updated:** October 30, 2025  
**Purpose:** Maintain context across Claude conversations to avoid repetition

---

## 🎯 Project Mission

Build a newsroom content management system that enables multi-desk coordination for Stories, Assets, Storylines, Events, and streaming content.

---

## 📊 Current State

### Version
**0.1.0** - Project Setup Phase

### What's Complete
- Product backlog (26 features defined)
- Project structure established
- Documentation framework created

### What's In Progress
- Tech stack decision
- Database schema design
- Development environment setup

### What's Next
1. Choose backend framework (FastAPI vs Express)
2. Choose frontend framework (React vs Vue)
3. Design database schema for core entities
4. Set up basic project scaffolding

---

## 🔑 Key Decisions Made

### Architecture Approach
- Clean separation of concerns (backend/frontend)
- API-first design
- Real-time collaboration support required
- Integration with Stellar content system

### MVP Scope (Phase 1)
**13 Foundational Features:**
1. Story (Core Entity) - CRITICAL
2. Asset (Core Entity) - CRITICAL
3. Freeform Notes - CRITICAL
4. Story-Asset Linking - HIGH
5. Storyline (Core Entity) - HIGH
6. Events (Core Entity) - HIGH
7. Reporting Guidance (Core Entity) - MEDIUM
8. Tags for Desk/Team/People/TRIAD - CRITICAL
9. Legal/TRIAD Flag - HIGH
10. Desks Awareness Tag - HIGH
11. Daily View per Desk/Team - CRITICAL
12. Links/Attachments - MEDIUM
13. Streaming Calendar - HIGH

---

## 📁 Repository Structure

```
storyhub/
├── docs/
│   ├── BACKLOG.md          # ✅ Complete product backlog
│   ├── CONTEXT.md          # ✅ This file
│   ├── ARCHITECTURE.md     # 🔄 To be created
│   ├── DATABASE_SCHEMA.md  # 🔄 To be created
│   └── API_SPEC.md         # 🔄 To be created
├── src/
│   ├── backend/            # Backend code (not yet created)
│   ├── frontend/           # Frontend code (not yet created)
│   └── shared/             # Shared utilities (not yet created)
├── README.md               # ✅ Project overview
└── package.json            # To be created based on tech choice
```

---

## 🚫 What We're NOT Keeping

From the previous version, we're starting fresh and only keeping:
- The product backlog (transformed from capabilities CSV)
- The project concept and mission

We're NOT keeping:
- Old mock data implementations
- Previous component structure
- Single-file React component approach
- Vite configuration (will recreate as needed)

---

## 💬 Common Questions & Answers

### Q: What tech stack should we use?
**A:** Not decided yet. Options under consideration:
- Backend: FastAPI (Python) or Express (Node.js)
- Frontend: React or Vue
- Database: PostgreSQL (preferred)

### Q: What's the relationship with Stellar?
**A:** StoryHub integrates with Stellar (existing CNN system):
- Story content links to Stellar leaves
- Asset publication links to Stellar components
- Branding metadata comes from Stellar

### Q: What teams will use this?
**A:** 
- Reporters and Editors (daily story tracking)
- Desk Chiefs (team coordination)
- Global Planning (event coverage)
- Streaming Team (programming calendar)
- Legal/TRIAD (review workflow)

### Q: What's the MVP timeline?
**A:** Targeting 6 sprints (approximately 3 months) for full MVP with all 13 foundational features

---

## 🎨 Design Principles

### User Experience
- **Desk-centric views** - Each team sees what's relevant to them
- **Real-time collaboration** - Multiple users can work simultaneously
- **Flexible filtering** - By desk, date, status, tags, etc.
- **Calendar-based planning** - Especially for Streaming team

### Technical Principles
- **API-first** - Backend exposes REST API
- **Real-time updates** - WebSockets or SSE for live collaboration
- **Scalable** - Support 100+ concurrent users
- **Integration-ready** - Clean APIs for Stellar and future systems

---

## 🔄 Development Workflow

### For Claude Conversations

**Starting Fresh:**
```
I'm working on StoryHub. Here's where we are:

Context: [link to CONTEXT.md]
Backlog: [link to BACKLOG.md]

I want to work on: [specific task]
```

**After Making Progress:**
1. Update this CONTEXT.md with what was completed
2. Update status in BACKLOG.md for affected features
3. Commit changes to GitHub
4. Include updated links in next conversation

### Version Control Strategy
- `main` branch: stable, deployable code
- Feature branches: `feature/story-entity`, `feature/asset-linking`, etc.
- Regular commits with descriptive messages
- Update docs in same commit as code changes

---

## 📝 Entity Relationships (High-Level)

```
Story
  ├─ has many Assets (through Story-Asset Links)
  ├─ belongs to Storyline (optional)
  ├─ has many Freeform Notes
  ├─ has many Tags
  └─ has many Links/Attachments

Asset
  ├─ linked to many Stories
  ├─ linked to Storylines (optional)
  ├─ has many Freeform Notes
  ├─ has many Tags
  └─ has many Links/Attachments

Storyline
  ├─ has many Stories
  ├─ has many Assets
  ├─ has many Events
  └─ has many Freeform Notes

Event
  ├─ belongs to Storyline (optional)
  └─ has many Freeform Notes

Daily View
  ├─ filtered by Desk/Team
  ├─ shows Stories, Assets, Events
  └─ displays Reporting Guidance
```

---

## 🎯 Immediate Next Steps

### Decision Needed: Tech Stack
**Options for Discussion:**

**Backend Option A: FastAPI (Python)**
- Pros: Fast, modern, type hints, async support
- Cons: Smaller ecosystem than Node

**Backend Option B: Express (Node.js)**
- Pros: Large ecosystem, JavaScript everywhere
- Cons: More boilerplate, less opinionated

**Frontend Option A: React**
- Pros: Large ecosystem, widely known, great tooling
- Cons: More complex for simple tasks

**Frontend Option B: Vue**
- Pros: Easier learning curve, clean syntax
- Cons: Smaller ecosystem

**Recommendation:** Need to decide in next conversation

### After Tech Stack Decision
1. Create basic project scaffolding
2. Set up development environment
3. Design database schema for Story and Asset
4. Create first API endpoint (GET /stories)
5. Create first frontend component (Story list)

---

## 📚 Key Documents

| Document | Status | Purpose |
|----------|--------|---------|
| BACKLOG.md | ✅ Complete | All 26 features with descriptions |
| README.md | ✅ Complete | Project overview and setup |
| CONTEXT.md | ✅ Complete | This file - conversation continuity |
| ARCHITECTURE.md | 📝 Planned | Technical architecture decisions |
| DATABASE_SCHEMA.md | 📝 Planned | Entity models and relationships |
| API_SPEC.md | 📝 Planned | REST API documentation |

---

## 💾 Data Persistence

### Core Entities Storage Requirements

**Story:**
- Text fields: headline, description, status
- References: owner IDs, desk ID, storyline ID
- Timestamps: created, updated, estimated publish, embargo
- Links: content URLs, sponsorship info

**Asset:**
- Text fields: content type, format, status
- References: owner IDs, story IDs, storyline ID
- Binary/links: actual media files or URLs
- Metadata: rights management, permissions

**Notes:**
- Rich text with limited formatting
- User tracking (creator, last editor)
- Timestamps (created, last edited)
- Parent entity reference (Story, Asset, etc.)

---

## ⚠️ Important Constraints

### Integration Requirements
- Must integrate with Stellar content management system
- Must support real-time collaboration (multiple users in same note)
- Must handle timezone-aware scheduling
- Must support file attachments/links

### Performance Requirements
- Support 100+ concurrent users
- Real-time updates < 1 second latency
- Fast filtering/searching across large datasets
- Calendar views must load quickly

### Security Requirements
- User authentication required
- Role-based access control (by desk)
- Legal/TRIAD review tracking audit trail
- Secure file upload handling

---

## 🔗 External Systems

### Stellar (Existing CNN System)
- Stories link to Stellar leaves
- Assets link to Stellar components
- Branding metadata from Stellar
- Data needs to flow both ways

### Future Integrations
- CNN Guest Book (outreach tracking)
- DART Team dashboards (analytics)
- Other newsroom systems TBD

---

## 📞 Contact / Stakeholders

*(To be filled in)*

- Product Owner:
- Tech Lead:
- Key Stakeholders:
  - Global Planning Team
  - Streaming Team
  - Legal/TRIAD Team
  - Daily Video Team

---

## 🎓 Learning Resources

### If Using FastAPI
- https://fastapi.tiangolo.com/
- https://sqlalchemy.org/ (for database)

### If Using Express
- https://expressjs.com/
- https://www.prisma.io/ (for database)

### Frontend Resources
- React: https://react.dev/
- Vue: https://vuejs.org/

### Database
- PostgreSQL: https://www.postgresql.org/docs/

---

**Remember:** This file should be updated after each significant development session to maintain continuity across conversations!
