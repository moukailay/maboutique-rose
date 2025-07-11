# Replit.md - E-commerce Natural Products Site

## Overview

This is a modern e-commerce web application specialized in natural products, built with a React frontend and Express.js backend. The application features a clean, responsive design with a focus on natural aesthetics and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for cart state
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Server**: Node.js with ESM modules
- **API**: RESTful API endpoints

## Key Components

### Frontend Structure
- **Pages**: Home, Products, Product Detail, About, Contact, Cart, Checkout
- **Components**: Header (sticky navigation), Footer, ProductCard, CartSidebar
- **UI Components**: Complete shadcn/ui component library integration
- **Theming**: CSS custom properties with natural color palette (forest green, earth tones)

### Backend Structure
- **Routes**: Product management, categories, orders, reviews, contact forms, newsletter
- **Storage**: Interface-based storage system with in-memory implementation
- **Database Schema**: Users, products, categories, orders, order items, reviews, contacts, newsletters

### Database Schema
```sql
- users (authentication and profile data)
- categories (product categorization)
- products (product catalog with images and inventory)
- orders (order management)
- order_items (order line items)
- reviews (product reviews and ratings)
- contacts (contact form submissions)
- newsletters (newsletter subscriptions)
```

## Data Flow

1. **Product Browsing**: Users browse products through category filtering and search
2. **Cart Management**: Client-side cart state with persistent storage
3. **Order Processing**: Form-based checkout with order creation
4. **Content Management**: Contact forms and newsletter subscriptions
5. **Review System**: Product reviews with rating system

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, ReactDOM, React Query)
- UI Components (@radix-ui/* components)
- Styling (Tailwind CSS, class-variance-authority)
- Utilities (date-fns, clsx, lucide-react icons)

### Backend Dependencies
- Database (Drizzle ORM, PostgreSQL, Neon serverless)
- Validation (Zod for schema validation)
- Session management (connect-pg-simple)
- Development tools (tsx, esbuild)

### Development Tools
- TypeScript for type safety
- Vite for development server and build
- Replit-specific plugins for development environment
- ESBuild for server bundling

## Deployment Strategy

### Development
- Vite dev server for frontend
- tsx for TypeScript execution in development
- Hot module replacement enabled
- Replit integration with cartographer and runtime error overlay

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: ESBuild bundle to `dist/index.js`
- Database: Drizzle migrations system
- Environment: NODE_ENV-based configuration

### Configuration
- Database URL required via environment variable
- Drizzle config for PostgreSQL dialect
- Path aliases for clean imports (@/, @shared/)
- Tailwind CSS configuration with custom theme

The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for an e-commerce platform focused on natural products.