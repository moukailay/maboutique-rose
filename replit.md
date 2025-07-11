# Replit.md - E-commerce Natural Products Site

## Overview

This is a modern e-commerce web application specialized in natural products called "ROSE-D'ÉDEN", built with a React frontend and Express.js backend. The application features a complete authentication system for both customers and administrators, with a clean, responsive design focused on natural aesthetics and user experience. The app uses JWT-based authentication with dropdown login in the header and separate customer/admin login pages.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Pink color scheme with "ROSE-D'ÉDEN" branding throughout the site.
Authentication requirement: JWT-based authentication with dropdown in header and separate customer/admin pages.
Language: Multi-language support (French/English) with language selector in header.
Currency: All prices displayed in Canadian Dollars (CAD).

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
- **Pages**: Home, Products, Product Detail, About, Contact, Cart, Checkout, Login, Register
- **Admin Pages**: Login, Dashboard, Products, Categories, Orders, Customers, Reviews, Settings
- **Components**: Header (sticky navigation with AuthDropdown, LanguageSelector, and ThemeSelector), Footer, ProductCard, CartSidebar
- **Auth Components**: AuthProvider, AuthDropdown, Login/Register forms
- **Translation Components**: TranslationProvider, LanguageSelector, useTranslation hook
- **Theme Components**: ThemeProvider, ThemeSelector, useTheme hook
- **UI Components**: Complete shadcn/ui component library integration
- **Theming**: CSS custom properties with rose/pink color palette for ROSE-D'ÉDEN branding, full dark/light theme support

### Backend Structure
- **Routes**: Authentication (login/register/verify), Product management, categories, orders, reviews, contact forms, newsletter
- **Storage**: Interface-based storage system with in-memory implementation
- **Database Schema**: Users (with role field), products, categories, orders, order items, reviews, contacts, newsletters
- **Authentication**: JWT-based authentication with role-based access control

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

1. **Authentication**: JWT-based login/register with role-based access control
2. **Product Browsing**: Users browse products through category filtering and search
3. **Cart Management**: Client-side cart state with persistent storage
4. **Order Processing**: Form-based checkout with order creation
5. **Content Management**: Contact forms and newsletter subscriptions
6. **Review System**: Product reviews with rating system
7. **Admin Management**: Complete admin interface for managing products, orders, users, and settings

## Recent Changes (January 2025)

### Authentication System Implementation
- Added JWT-based authentication with separate customer and admin login systems
- Created AuthProvider context for global authentication state management
- Implemented AuthDropdown component in header with login/logout functionality
- Added separate Login and Register pages for customers
- Updated backend with authentication routes (/api/auth/login, /api/auth/register, /api/auth/verify)
- Added role-based access control (user/admin roles)
- Created default admin user (admin@rose-d-eden.fr / admin123)
- Implemented complete admin interface with all management capabilities

### Multi-Language Translation System (January 2025)
- Created comprehensive translation system with French/English support
- Added useTranslation hook with TranslationProvider context
- Implemented LanguageSelector component with dropdown menu
- Added translation keys for all major UI elements (navigation, home page, products, auth, admin)
- Updated Header, Home, Products, and AuthDropdown components to use translations
- Language preference persisted in localStorage
- Ready for extension to additional languages

### Dark/Light Theme System (January 2025)
- Created comprehensive theme switching system with dark/light mode support
- Added useTheme hook with ThemeProvider context
- Implemented ThemeSelector component with sun/moon icons
- Added CSS variables for dark theme variants in index.css
- Updated Header, Home, and Products pages with dark mode classes
- Theme preference persisted in localStorage with system preference detection
- Integrated theme translations in both French and English

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