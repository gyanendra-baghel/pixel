# Gallery Service

This service handles the gallery and image management system for the platform. It allows for creating galleries, submitting images, reviewing images, and controlling user access.

## Prerequisites

- Docker and Docker Compose (for containerization)
- Node.js v16+
- Prisma ORM for database management

## Installation

1. Clone the repository:

```bash
git clone https://your-repository-url
cd gallery-service
```
Install dependencies:

```bash
npm install
```
Create the .env file based on the .env.example.

Start the app with Docker Compose:

```bash
docker-compose up --build
```
This will start both the app and the PostgreSQL database.

API Endpoints
- POST /api/galleries - Create a new gallery
- GET /api/galleries - Get all galleries
- DELETE /api/galleries/:id - Delete a gallery
- POST /api/images - Submit an image
- PATCH /api/images/review/:imageId - Review an image (admin only)
- POST /api/access/grant - Grant user access to a gallery (admin only)
- GET /api/access/my-galleries - Get galleries the user has access to



```bash
docker-compose up --build
```

Access the application on http://localhost:5000.
