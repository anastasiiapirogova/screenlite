# Screenlite
Screenlite is an open-source digital signage solution, providing an alternative to costly proprietary software.

Get in early, use it now, and help shape what comes next. Your feedback, insights, and contributions will directly influence the future of Screenlite. Together, we’ll create a solution that’s simple, powerful, and truly free.

## ⚠️ **Development notes:**  

Screenlite is currently **in public development** and **not ready for production use**. It’s not feature-complete yet.

**The client-side experience is partially broken** — you can explore the interface, but expect bugs, errors, and incomplete features.

I am currently working on the file management module (last updated on 2025-06-21):

- Resumable multipart uploads
- Video previews with ffmpeg
- Metadata generation with ffprobe
- Drag and drop file management
- Moving files/folders to trash, clearing trash, and force deletes
- Auto-updating playlists when related files are deleted
- Support for local and S3 storage (DONE)
- Serving static content to clients (DONE)
- Optimized thumbnail generation with ETags (DONE)

[Check progress in the feature list](FEATURES.md)

Database migrations may not be incremental at this stage. Sometimes migrations will be cleared and recreated, requiring you to reset your database to run newer versions of the app.

## Community
Join our Discord community for quick support, connect with other users, and share ideas.

[Join our Discord](https://discord.gg/2wW8zDjAjr)

## How it works?

Screenlite consists of two main components:
- **Screenlite CMS**: The backend that manages content, schedules, and devices.
- **Screenlite Player**: The client app that displays content on screens.

This repository contains the Screenlite CMS, which is the core of the system. It provides a web interface for managing your digital signage content and devices.

It is centralized, meaning you can manage all your screens from a single place.

## Available players
### Web player
[screenlite/web-player](https://github.com/screenlite/web-player)

A web-based player that can run on any device with a modern browser.

## Deployment
Screenlite is simple to set up and deploy. You can quickly configure and get it running with minimal effort.

[See deployment instructions](DEPLOYMENT.md)

## Security overview

Screenlite follows modern web security best practices to ensure the safety of user data and system integrity. For a detailed explanation of our security approach please refer to the [SECURITY_OVERVIEW.md](./SECURITY_OVERVIEW.md) file.

## Spotted a bug? Want to suggest a feature?
Let us know by opening an issue on GitHub.

## Contribute
If you have coding skills, feel free to explore the code, suggest improvements, or submit a pull request.

UI/UX designers are also welcome. Your ideas and expertise can help make Screenlite more intuitive and user-friendly.

Let’s build something great together.

## Tech stack

- **Backend:** Express.js, TypeScript, Zod, Prisma ORM, BullMQ, Socket.IO, PostgreSQL, Redis, S3-compatible storage
- **Frontend:** React, Tanstack Query, Tailwind CSS, dnd kit, Zustand
