# StoryHub Setup Guide

This guide will help you set up StoryHub for local development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Git** - Version control
- **Node.js** 18+ and npm - JavaScript runtime
- **PostgreSQL** 14+ - Database
- **Python** 3.11+ (if using FastAPI backend)

### Optional
- **Docker** - For containerized development
- **Redis** - For caching (optional)

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/storyhub.git
cd storyhub
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Important variables to configure:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate a secure random string
- `STELLAR_API_KEY` - Get from Stellar admin (if available)

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb storyhub

# Or using psql
psql -U postgres
CREATE DATABASE storyhub;
\q
```

#### Option B: Docker PostgreSQL

```bash
docker run --name storyhub-db \
  -e POSTGRES_DB=storyhub \
  -e POSTGRES_USER=storyhub \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Install Dependencies

#### If using Node.js backend:
```bash
npm install
```

#### If using Python backend:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Run Database Migrations

```bash
# This command will be added once migrations are set up
npm run migrate
# or
python manage.py migrate
```

### 6. Start Development Server

#### Backend:
```bash
npm run dev:backend
# or
python main.py
```

#### Frontend (in another terminal):
```bash
npm run dev:frontend
```

### 7. Verify Installation

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/docs (if using FastAPI)

---

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.js
```

### Code Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

### Database Commands

```bash
# Create new migration
npm run migrate:create "migration_name"

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database (DANGER: deletes all data)
npm run db:reset
```

---

## Project Structure

```
storyhub/
├── docs/                    # Documentation
│   ├── BACKLOG.md          # Product backlog
│   ├── CONTEXT.md          # Development context
│   ├── ARCHITECTURE.md     # Architecture decisions
│   └── DATABASE_SCHEMA.md  # Database design
│
├── src/
│   ├── backend/            # Backend API
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   │
│   ├── frontend/          # Frontend application
│   │   ├── components/   # React/Vue components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API clients
│   │   └── utils/        # Utilities
│   │
│   └── shared/            # Shared code
│       └── types/        # TypeScript types
│
├── tests/                  # Test files
│   ├── backend/
│   └── frontend/
│
├── scripts/                # Build/deployment scripts
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
└── README.md              # Project overview
```

---

## Common Issues & Solutions

### Database Connection Failed

**Problem:** Can't connect to PostgreSQL

**Solutions:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in .env file
3. Ensure database exists: `psql -l`
4. Check firewall settings

### Port Already in Use

**Problem:** Port 3000 or 5173 already in use

**Solutions:**
1. Find process using port: `lsof -i :3000`
2. Kill process: `kill -9 <PID>`
3. Or change port in .env file

### Dependencies Installation Failed

**Problem:** npm install or pip install fails

**Solutions:**
1. Clear cache: `npm cache clean --force`
2. Delete node_modules and reinstall
3. Check Node.js/Python version
4. Check network connection

### Frontend Can't Connect to Backend

**Problem:** API calls fail from frontend

**Solutions:**
1. Verify backend is running
2. Check FRONTEND_URL in backend .env
3. Check API base URL in frontend config
4. Verify CORS settings

---

## Development Tools

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Python** (if using Python)
- **PostgreSQL** - Database management
- **REST Client** - Test API endpoints
- **GitLens** - Git visualization

### Useful Commands

```bash
# View database tables (psql)
psql -U storyhub -d storyhub
\dt

# View logs
npm run logs

# Build for production
npm run build

# Start production server
npm start
```

---

## Docker Development (Optional)

If you prefer containerized development:

```bash
# Build containers
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

---

## Next Steps

After setup is complete:

1. Read the [Architecture Documentation](docs/ARCHITECTURE.md)
2. Review the [Product Backlog](docs/BACKLOG.md)
3. Check the [Database Schema](docs/DATABASE_SCHEMA.md)
4. Read the [API Specification](docs/API_SPEC.md)

---

## Getting Help

- Check documentation in `/docs`
- Review this setup guide
- Ask in team Slack/Discord
- Create an issue on GitHub

---

## Contributing

See CONTRIBUTING.md for guidelines on:
- Code style
- Commit messages
- Pull request process
- Testing requirements

---

**Happy coding! 🚀**
