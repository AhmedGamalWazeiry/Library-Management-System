# Project Name

## Getting Started

To run the project, follow these steps:

1. Open a terminal in the project directory.

2. Run the following command to build and start the project using Docker:
   ```bash
   docker-compose up --build
   ```

## API Documentation

Once the project is running, you can access the API documentation at [http://localhost:3000/api/docs/](http://localhost:3000/api/docs/). This page provides detailed information about the available API endpoints and how to interact with them.

## Database Design

The database design can be found in the `Schema-design` folder. Explore the schema files to understand the structure and relationships within the database.

## Rate Limiter

Rate limiting has been applied to the following endpoints to ensure fair usage:

Export Overdue Books Last Month:

- Endpoint: http://localhost:3000/api/v1/borrowed-books/export-over-due-books-last-month

Export Borrowed Books Process Last Month:

- Endpoint: http://localhost:3000/api/v1/borrowed-books/export-borrow-books-proccess-last-month
