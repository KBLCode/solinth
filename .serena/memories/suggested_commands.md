# Solinth Suite - Essential Commands

## Development Commands
```bash
# Start development server
pnpm dev
# or
npm run dev

# Build for production
pnpm build
# or
npm run build

# Start production server
pnpm start
# or
npm run start

# Type checking
pnpm type-check
# or
npm run type-check

# Linting
pnpm lint
# or
npm run lint
```

## Database Commands
```bash
# Generate Prisma client
pnpm db:generate
# or
npm run db:generate

# Push schema to database
pnpm db:push
# or
npm run db:push

# Run migrations
pnpm db:migrate
# or
npm run db:migrate

# Seed database
pnpm db:seed
# or
npm run db:seed
```

## Testing Commands
```bash
# Run tests
pnpm test
# or
npm run test

# Run tests in watch mode
pnpm test:watch
# or
npm run test:watch

# Run tests with coverage
pnpm test:coverage
# or
npm run test:coverage
```

## Git Commands (macOS)
```bash
# Standard git operations
git status
git add .
git commit -m "message"
git push
git pull

# Branch operations
git checkout -b feature/branch-name
git merge main
git branch -d branch-name
```

## System Commands (macOS)
```bash
# File operations
ls -la          # List files with details
find . -name    # Find files by name
grep -r         # Search in files
cat filename    # Display file content
head -n 20      # Show first 20 lines
tail -n 20      # Show last 20 lines

# Process management
ps aux          # List processes
kill -9 PID     # Kill process
lsof -i :3000   # Check what's using port 3000
```

## Docker Commands (Local Development)
```bash
# Start local services
docker-compose up -d

# Stop local services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up --build
```