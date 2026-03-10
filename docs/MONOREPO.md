PROJECT: SORAKU PLATFORM
REPOSITORY: SorakuCommunity/Soraku
ARCHITECTURE: MONOREPO
ROLE: FULL STACK DEVELOPMENT SYSTEM

================================================
PRIMARY OBJECTIVE
================================================

You are responsible for developing the Soraku platform
as a scalable community ecosystem for Japanese pop culture.

The platform combines:

Community platform
Anime media platform
Creator support system
Streaming platform
Mobile ecosystem

Your job is to build the platform following the architecture,
design system, and development workflow defined in this document.

You must NOT break the system structure.

All development must follow the modular architecture.

================================================
MONOREPO STRUCTURE
================================================

Repository structure must always follow this pattern.

SorakuCommunity/Soraku

apps/
    web/
    stream/
    mobile/

services/
    api/
    bot/

packages/
    ui/
    types/
    utils/
    auth/
    config/

database/
    schema/
    migrations/
    seed/

infrastructure/
    docker/
    scripts/

docs/

Never change this structure unless instructed.

================================================
APPLICATION RESPONSIBILITIES
================================================

apps/web

Main Soraku platform.

Built with:

Next.js
TypeScript

Features include:

User authentication
User profiles
Community system
Articles
Events
Gallery
Supporter system

------------------------------------------------

apps/stream

Streaming platform.

Features:

Anime catalog
Episode database
Watch page
Video player
Watch history

------------------------------------------------

apps/mobile

Mobile application.

Stack:

React Native or Expo

Features:

Community access
Notifications
Streaming player
User profile

================================================
BACKEND SERVICES
================================================

services/api

Central API for the entire platform.

Responsible for:

Authentication
User management
Community data
Content management
Events
Gallery
Supporter system
Streaming metadata
Notifications
Webhook processing

All client apps communicate through this API.

------------------------------------------------

services/bot

Discord integration service.

Responsibilities:

Discord role synchronization
Supporter role updates
Event notifications
Community automation

================================================
SHARED PACKAGES
================================================

packages/ui

Reusable UI components shared across apps.

------------------------------------------------

packages/types

Shared TypeScript types.

Examples:

User
Post
Event
Supporter
StreamEpisode

------------------------------------------------

packages/utils

Shared utilities and helper functions.

------------------------------------------------

packages/auth

Shared authentication logic.

Examples:

JWT helpers
OAuth helpers
Session management

------------------------------------------------

packages/config

Shared configurations.

Includes:

ESLint config
TypeScript config
Environment constants

================================================
DATABASE DESIGN
================================================

Database type:

PostgreSQL or Supabase

Domain separation:

Auth
Users
Community
Content
Events
Gallery
Supporters
Streaming
System

Standard fields for every table:

id (UUID)
createdAt
updatedAt

Database changes must always use migrations.

Never modify production tables directly.

================================================
SYSTEM ARCHITECTURE
================================================

Soraku uses layered architecture.

Client Applications
↓
API Layer
↓
Domain Services
↓
Database

Clients include:

Web App
Streaming App
Mobile App
Discord Bot

Clients communicate ONLY with the API.

================================================
DESIGN SYSTEM
================================================

UI style must follow Soraku design identity.

Design philosophy:

Modern
Clean
Futuristic
Anime inspired
Community focused

------------------------------------------------

Primary Color

#6C5CE7

------------------------------------------------

Accent Color

#38BDF8

------------------------------------------------

Background

#020617
#0F172A
#111827

------------------------------------------------

Typography

Primary font

Inter

Secondary font

Poppins

Optional accent font

Orbitron or Space Grotesk

------------------------------------------------

Card Style

Glass style

background: rgba(255,255,255,0.06)
backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px

================================================
FEATURE DOMAINS
================================================

Core domains of the platform.

Auth System
User System
Community System
Content System
Events System
Gallery System
Supporter System
Streaming System
Notification System
Admin System

Each domain must be developed independently.

================================================
CORE FEATURES
================================================

Auth

User registration
Email login
OAuth login
Discord login
Password reset
Email verification
Two factor authentication

------------------------------------------------

User Profile

Profile page
Avatar
Bio
Badges
Activity timeline
Achievements
Social links

------------------------------------------------

Community

Community feed
Create post
Edit post
Delete post
Reactions
Comments
Replies
Post bookmarking
Trending posts
Follow users

------------------------------------------------

Content

Article publishing
Categories
Tags
Author profiles
Comments
Reactions
Trending articles

------------------------------------------------

Events

Event creation
Event calendar
RSVP
Event reminders

------------------------------------------------

Gallery

Image upload
Fan art gallery
Cosplay gallery
Artwork reactions
Featured artworks

------------------------------------------------

Supporter System

Supporter tiers:

Donatur
VIP
Kizuna Elite

Supporter badges
Donation history
Supporter events

------------------------------------------------

Streaming

Anime catalog
Episode database
Streaming player
Watch history
Recommendations

================================================
DEVELOPMENT WORKFLOW
================================================

Branch strategy

main
stable production

develop
active development

feature/[name]

fix/[name]

refactor/[name]

------------------------------------------------

Development process

Create feature branch
Develop feature
Open pull request
Code review
Merge to develop
Release to main

================================================
COMMIT MESSAGE FORMAT
================================================

type(scope): description

Examples

feat(auth): add discord login
feat(community): add post reactions
fix(api): fix token validation
refactor(profile): improve user schema

================================================
VERSIONING
================================================

Semantic Versioning.

MAJOR.MINOR.PATCH

Example:

1.2.0

Major
breaking change

Minor
new feature

Patch
bug fix

================================================
SAFE REBUILD RULES
================================================

The platform must always support safe rebuilding.

Rules:

Modules must be independent
Services must communicate through API
Database migrations must be reversible
Shared packages must be reused

Examples:

Community system can be rebuilt without affecting streaming.

Streaming system can be updated without affecting articles.

Supporter system can evolve without breaking user profiles.

================================================
FINAL OBJECTIVE
================================================

Soraku must evolve into a full ecosystem platform combining:

Community interaction
Anime media platform
Creator economy
Streaming services
Mobile ecosystem

The system must remain scalable, modular,
and maintainable for long term development.