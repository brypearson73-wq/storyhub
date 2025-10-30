# StoryHub Product Backlog

**Last Updated:** October 30, 2025  
**Project:** StoryHub - Newsroom Content Management System

---

## Overview

This backlog represents the complete feature set for StoryHub, organized by implementation priority:
- **Foundational**: Core features required for MVP
- **Evolutionary**: Enhanced features for mature product
- **Revolutionary**: Advanced features for competitive advantage

---

## 🎯 FOUNDATIONAL FEATURES (MVP Priority)

### Core Entities

#### 1. Story
**Type:** Core Entity  
**Priority:** CRITICAL

A Story is any text-based article or Live Story to be published standalone. Stories are the core unit of work tracked throughout the reporting and production process.

**Required Fields:**
- Headline
- Description (Budget Line)
- Story Owners (reporter/editor with optional role field)
- Desk/Section
- Estimated Publish Date
- Status (idea, draft, published, spiked)
- Content links (Stellar leaf integration)
- Embargo times
- Sponsorship information (derived from Stellar Branding metadata)

**Status:** Not Started

---

#### 2. Asset
**Type:** Core Entity  
**Priority:** CRITICAL

Multimedia storytelling elements including photos, videos, graphics, maps, audio, video loops, animated graphics, static illustrations, homepage assets, and interactive elements.

**Required Fields:**
- Personnel assignments (producers, editors, crews)
- Content type (user-defined)
- Format (e.g., vertical vs 16:9 for video)
- Publication link (Stellar integration)
- Rights management
- Permissions/release forms (Freeform Note)
- Status tracking

**Relationships:**
- Can be standalone
- Can link to Stories
- Can link to Storylines

**Status:** Not Started

---

#### 3. Storyline
**Type:** Core Entity  
**Priority:** HIGH

Overarching coverage areas or multi-day topics that organize related Stories and Assets under a common reference.

**Examples:**
- Specific events (assassination, strikes, natural disasters)
- Ongoing coverage (government shutdown, elections, royal weddings)
- Major news developments (papal succession)

**Purpose:** Organizing principle for planning and coordinating coverage across teams and desks

**Status:** Not Started

---

#### 4. Events
**Type:** Core Entity  
**Priority:** HIGH

Specific newsworthy occurrences with defined dates, times, and locations requiring coverage planning.

**Required Fields (MVP):**
- Date, time, location
- Freeform Notes for details

**Future Enhancements:**
- Granular schedules (POTUS schedule, press conferences)
- Event locations with maps and directions
- Coverage type specifications (live shots, digital, TV)
- Camera positions
- Transmission methods
- Courtroom access procedures

**Central to:** Global Planning workflows

**Status:** Not Started

---

#### 5. Reporting Guidance
**Type:** Core Entity  
**Priority:** MEDIUM

Information and alerts about reporting that may not result in full stories, including editorial decisions and internal alerts.

**Use Cases:**
- Decisions about passing on studies/topics
- Reporting folded into broader stories
- Internal alerts from SEO team

**Required Fields:**
- Budget Line
- Estimated Publish Date
- Originating User
- Slug/title

**Attachment:** Must link to Storylines or Daily Views minimum

**Purpose:** Prevent redundant work, missed guidance during handoff, communicate coverage decisions

**Status:** Not Started

---

### Metadata Capabilities

#### 6. Freeform Notes
**Type:** Metadata  
**Priority:** CRITICAL

Open text fields for contextual information, editorial notes, production details, and collaborative comments.

**Required Features:**
- Title
- Creating User + timestamp
- Last edit User + timestamp
- Manageable for legibility
- Multiple notes per Core Entity
- Real-time collaboration support (multiple users in single note)
- Limited formatting (bullets, numbered lists)
- **Nice-to-have:** Track changes, comments, table layouts

**Applicable to:** Stories, Assets, Storylines, Daily Team Views, Streaming Calendar entries

**Status:** Not Started

---

#### 7. Story-Asset Linking
**Type:** Metadata  
**Priority:** HIGH

Establish relationships between Stories and related items (Assets, other Stories) and between Assets and multiple Stories.

**Benefits:**
- Track all content pieces for a story
- Understand which stories use specific assets
- Coordinate production
- Avoid duplicate work

**Requirements:**
- UX for linking in Story and Asset entities
- Data passing to Stellar for reflection/utilization

**Status:** Not Started

---

#### 8. Tags for Desk/Team/People/TRIAD
**Type:** Metadata  
**Priority:** CRITICAL

Comprehensive tagging system for organizing and filtering content.

**Tag Types:**
- Desk assignments (multiple)
- Team identifiers
- Personnel names (@ mentions)
- TRIAD review indicators

**Features:**
- Filtering
- Searching
- Notifications
- Many-to-one relationships support

**Applicable to:** Story, Asset, Storyline, Reporting Guidance, Streaming Calendar entry

**Powers:** Legal/TRIAD Flag, Desk Awareness Tag, filtered views

**Status:** Not Started

---

#### 9. Legal/TRIAD Flag
**Type:** Metadata  
**Priority:** HIGH

Marker indicating content requires or has received Legal/TRIAD team review.

**Features:**
- Alert mechanism for other users
- Freeform Note-like information capture
- **Does NOT include:** Deep workflow tracking and audit trail (see TRIAD Status Tracking)

**Status:** Not Started

---

#### 10. Desks Awareness Tag
**Type:** Metadata  
**Priority:** HIGH

Identifies which desk/team should be aware of specific Stories or Reporting Guidance.

**Desks:** Politics, Business, National, International, Health, Sports, Features, Science, Wellness

**Purpose:**
- Proactive cross-desk visibility
- Highlight content on Daily View for tagged teams
- Facilitate coordination
- Prevent duplication or missed awareness

**Status:** Not Started

---

#### 11. Links/Attachments
**Type:** Metadata  
**Priority:** MEDIUM

Attach or link to supporting materials.

**Supported Materials:**
- Documents, PDFs
- Video clips
- Script links (regular and vertical)
- Preview links
- GitHub links (for Interactives)
- Study papers
- Other reference materials

**Critical for:** Science/wellness teams tracking embargoed studies

**Applicable to:** Story, Asset, Storyline, Reporting Guidance, Streaming Calendar entry

**Status:** Not Started

---

### Views & Pages

#### 12. Daily View per Desk/Team
**Type:** Page  
**Priority:** CRITICAL

Filtered view for specific desks mapping to Desk or Team tags.

**Displays:**
- Stories specific to desk/team for the day
- Assets specific to desk/team for the day
- Reporting activities (Reporting Guidance, Desks Awareness)
- Freeform Notes
- Relevant Storylines
- Personnel assignments
- Content scheduled to publish that day

**Purpose:** Manage day-to-day operations, consolidated picture of team work

**Note:** Separate from general dashboard/"Stellar Asset List"/"Editorial List"

**Status:** Not Started

---

#### 13. Streaming Calendar
**Type:** View  
**Priority:** HIGH

Calendar-based timeline view for managing streaming content and programming.

**Tracks:**
- Series and episodes
- Release dates
- Anticipated start/end times
- Livestream assignments (1-8, with 1-4 free, 5-8 paywall)
- Thumbnails
- Routers and sources
- Production notes
- Content entitlements (free vs paid)

**View Options:**
- Single day view
- Week-long view
- NOT monthly calendar view

**Purpose:** Support Streaming team's unique timeline-based workflow

**Status:** Not Started

---

## 🚀 EVOLUTIONARY FEATURES (Phase 2)

### Core Entities

#### 14. Planning Templates
**Type:** Core Entity  
**Priority:** MEDIUM

Predefined structures for different coverage plans that can be reused and adapted.

**Requirements:**
- 4-5 different template types
- Reusable and adaptable
- Support for advance planning (6 months to day-before)
- Leverage legacy information from similar coverages

**Requested by:** Global Planning team

**Status:** Not Started

---

#### 15. Assignments - Availability
**Type:** Core Entity  
**Priority:** MEDIUM

Day-by-day and regular scheduling for tracking user availability.

**Features:**
- Track specific user and role
- Working times with timezone designation
- Exception management (sickness, etc.)

**Status:** Not Started

---

### Views

#### 16. Weekly/Custom Views
**Type:** View  
**Priority:** MEDIUM

Flexible viewing options beyond daily desk view.

**Time Ranges:**
- Weekly
- Monthly
- Custom periods

**Purpose:** Look forward and backward from specific dates, understand coverage plans and resource allocation over longer time horizons

**Status:** Not Started

---

#### 17. Calendar Views
**Type:** View  
**Priority:** MEDIUM

Multiple calendar visualization options.

**View Types:**
- Daily
- Weekly
- Monthly
- Timeline
- EPG-style

**Primary Users:** Streaming and Programming teams

**Purpose:**
- Visualize content availability and scheduling across platforms
- Understand programming flow over time
- Track news events in relation to one another

**Status:** Not Started

---

### Metadata

#### 18. TRIAD Status Tracking
**Type:** Metadata  
**Priority:** MEDIUM

Enhanced tracking beyond simple flag for TRIAD review process.

**Tracks:**
- When review was requested
- Script review status
- Expected completion time
- Who conducted review(s)
- Final sign-off

**Purpose:** Manage review process, understand bottlenecks in approval workflow

**Status:** Not Started

---

#### 19. Stories/Assets for Re-promotion
**Type:** Metadata  
**Priority:** LOW

Section within Storylines or Daily View per Desk/Team for curating content for re-promotion.

**Features:**
- Not limited to evergreen content
- Reference or repromote in coverage

**Status:** Not Started

---

#### 20. Event Tick-Tocks
**Type:** Metadata  
**Priority:** MEDIUM

Detailed scheduling information showing specific times within events.

**Features:**
- Minute-by-minute or hour-by-hour breakdowns
- POTUS schedule tracking
- Sequential activity tracking

**Purpose:** Coordinate coverage timing and resource deployment throughout the day

**Status:** Not Started

---

### AI Features

#### 21. AI-assisted Linking
**Type:** AI  
**Priority:** LOW

Use AI to find and suggest related associations.

**Initial Use Cases:**
- Re-promotion suggestions
- Story-Asset link suggestions
- Reporting Guidance tagging

**Status:** Not Started

---

## 💫 REVOLUTIONARY FEATURES (Future Vision)

### Core Entities

#### 22. Financial Budgets
**Type:** Core Entity  
**Priority:** LOW

Budget line items and financial information associated with coverage plans and events.

**Current State:** Tracked separately by Global Planning

**Purpose:** Integrate financial constraints and spending into planning and resource allocation

**Status:** Not Started

---

#### 23. Outreach Requests
**Type:** Core Entity  
**Priority:** LOW

System for tracking outreach attempts and communication with sources.

**Features:**
- Track outreach attempts
- Contact information
- Communication history
- Avoid duplicate outreach
- Track declined sources

**Note:** May need to reconcile with CNN Guest Book system

**Requested by:** Daily Video team (not critical for MVP)

**Status:** Not Started

---

### Metadata

#### 24. Competitive Coverage
**Type:** Metadata  
**Priority:** LOW

Information about other news organizations' coverage on specific topics.

**Purpose:**
- Understand competitive landscape
- Identify coverage gaps
- Make strategic resource allocation decisions
- Differentiate journalism with unique story angles

**Status:** Not Started

---

#### 25. Ratings & Engagement
**Type:** Metadata  
**Priority:** LOW

Data and metrics showing content performance.

**Metrics:**
- Audience reach
- Viewership
- Engagement
- Other performance indicators

**Purpose:** Analyze what resonates with audiences, inform future planning based on data-driven insights

**Note:** Consult DART Team about dashboard connections and analytic sources

**Status:** Not Started

---

#### 26. Assignments - Crews/Fiber/Satellite
**Type:** Metadata  
**Priority:** LOW

Detailed resource management for field operations.

**Tracks:**
- Crew deployment (names and locations)
- Equipment needs (cell phones, broadcast cameras, robo cams)
- Transmission hub details
- Fiber connectivity
- Satellite availability
- Technical logistics

**Purpose:** Coordinate technical infrastructure for large-scale deployments

**Example Use Case:** DC parade summer 2025

**Primary User:** Global Planning

**Status:** Not Started

---

## 📊 Summary Statistics

### By Priority Level
- **Foundational (MVP):** 13 features
- **Evolutionary (Phase 2):** 8 features
- **Revolutionary (Future):** 5 features
- **Total:** 26 features

### By Type
- **Core Entities:** 9 features
- **Metadata:** 13 features
- **Views/Pages:** 3 features
- **AI Features:** 1 feature

### By Status
- **Not Started:** 26 features
- **In Progress:** 0 features
- **Completed:** 0 features

---

## 🎯 Recommended MVP Scope

### Phase 1A - Core Functionality (Sprint 1-2)
1. Story (Core Entity)
2. Asset (Core Entity)
3. Freeform Notes
4. Tags for Desk/Team/People/TRIAD
5. Daily View per Desk/Team

### Phase 1B - Essential Features (Sprint 3-4)
6. Storyline (Core Entity)
7. Events (Core Entity)
8. Story-Asset Linking
9. Legal/TRIAD Flag
10. Desks Awareness Tag

### Phase 1C - MVP Complete (Sprint 5-6)
11. Reporting Guidance (Core Entity)
12. Links/Attachments
13. Streaming Calendar

---

## Notes

- All Foundational features are required for MVP
- Integration with Stellar system is assumed throughout
- Real-time collaboration is a recurring theme
- TRIAD/Legal workflow is critical for newsroom operations
- Multiple viewing modes needed for different teams (desk-based, streaming, planning)

---

**Next Steps:**
1. Review and prioritize backlog with stakeholders
2. Define technical architecture
3. Create database schema
4. Design API contracts
5. Begin Phase 1A development
