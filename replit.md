# Instagram Clone - Replit.md

## Overview

This is a full-stack Instagram clone application built with a modern tech stack. The application provides social media functionality including photo sharing, user interactions, stories, and real-time features. It's designed as a monorepo with separate client and server directories, using a shared schema for type safety across the stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 11, 2025)

✓ Successfully implemented complete Instagram clone with authentication
✓ Set up Rajnikant Dhar Dwivedi as primary user with profile photo
✓ Created sample users (Emma, Alex, Sarah) with realistic posts and interactions
✓ Fixed authentication flow and feed logic to show posts correctly
✓ Established follow relationships and social interactions
✓ Database properly seeded with engaging content for demonstration

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Instagram-inspired color scheme
- **Theme Support**: Light/dark mode with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with Express route handlers

### Database Strategy
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definition in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database schema migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Strategy**: Passport.js integration for authentication middleware
- **Session Storage**: PostgreSQL-backed sessions with `connect-pg-simple`
- **Security**: HTTP-only cookies with secure flags in production

### Core Features
1. **User Management**: Profile creation, editing, search, and follow system
2. **Content Sharing**: Photo posts with captions, locations, and metadata
3. **Social Interactions**: Likes, comments, and nested comment threads
4. **Stories**: Temporary content with 24-hour expiration
5. **Feed System**: Personalized content feed and explore page
6. **Real-time Features**: Notifications system for user interactions

### Component Architecture
- **Shared Components**: Reusable UI components in `/client/src/components/ui/`
- **Feature Components**: Domain-specific components (PostCard, ProfileHeader, etc.)
- **Layout Components**: Navigation and responsive layout management
- **Mobile Optimization**: Responsive design with mobile-first approach

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints under `/api/` prefix
2. **Query Management**: TanStack Query for caching and synchronization
3. **Authentication Flow**: Automatic token validation on protected routes
4. **Error Handling**: Centralized error boundaries and toast notifications

### Database Schema
- **Users**: Core user profiles with authentication data
- **Posts**: Photo content with metadata and relationships
- **Interactions**: Likes, follows, and comments with referential integrity
- **Stories**: Temporary content with automatic cleanup
- **Notifications**: Real-time user activity tracking
- **Sessions**: Secure session storage for authentication

## External Dependencies

### Frontend Dependencies
- **UI Libraries**: Radix UI primitives for accessible components
- **Utilities**: Class Variance Authority for component variants, clsx for conditional classes
- **Date Handling**: date-fns for time formatting and manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **Authentication**: OpenID Client for Replit Auth integration
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod with Drizzle integration for runtime type checking

### Development Tools
- **Type Safety**: TypeScript throughout the stack
- **Code Quality**: ESLint and Prettier (implied by project structure)
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Build Tools**: Vite for frontend, esbuild for backend bundling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds optimized static assets to `/dist/public/`
2. **Backend Build**: esbuild bundles server code to `/dist/index.js`
3. **Database Setup**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **Authentication**: Replit-specific environment variables for OAuth
- **Sessions**: Secure session secret for cookie signing
- **Development**: Automatic Replit integration for development workflow

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **Session Storage**: Database-backed sessions for horizontal scaling
- **Static Assets**: CDN-ready static file serving
- **API Design**: Stateless REST API suitable for load balancing

The application follows modern full-stack development practices with emphasis on type safety, developer experience, and scalable architecture patterns.