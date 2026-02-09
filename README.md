## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features

- Enter requirements as free text to generate a structured specification draft.
- Upload a requirements PDF for AI-assisted extraction and structuring.
- Guided Q&A flow to fill missing details and refine the spec.
- Live specification builder with collapsible sections.
- Export or copy the spec as Markdown or JSON.
- Resume analysis from the last session using local storage.
- Specification configuration lives in [src/lib/constants.ts](src/lib/constants.ts); update `CATEGORY_GUIDELINES` and the schema to adapt to different business cases.

## Configuration

The specification model is defined in [src/lib/constants.ts](src/lib/constants.ts). To adapt the app to new business cases:

- Update `CATEGORY_VALUES` to add or remove top-level sections.
- Edit `CATEGORY_GUIDELINES` to control what questions are generated per category.
- Keep `SCHEMA_OPEN_AI` in sync with the categories so the AI output matches your structure.

## Requirements examples

# example 1 - new system

The company operates a chain of urban grocery stores and wants to reduce food waste while improving product availability.
Currently, stock decisions are made manually and often lead to overstocking or empty shelves.

The goal of the system is to predict product demand and automatically recommend optimal replenishment quantities.
The system should reduce food waste by at least 15% within the first year.
It should also improve on-shelf availability for high-demand items during peak hours.

The backend will be implemented using Java with Spring Boot.
Data will be stored in PostgreSQL and processed using Python-based machine learning services.
The frontend will be a React web application hosted on a cloud platform (AWS).

# example 2 - frontend migration

Migrate the current jQuery-based application to Next.js to reduce technical debt, improve developer productivity, and support future product growth.

Migrate the existing application from jQuery to Next.js to modernize the frontend architecture, improve maintainability, and enable better performance and scalability.

# example 3 - mobile app

Short application description (EN)

The mobile application is designed for catering providers to plan and optimize daily delivery routes. It automatically calculates the shortest and most efficient routes based on delivery locations, time constraints, and traffic conditions, helping reduce delivery time, fuel costs, and operational effort. The app supports drivers and dispatchers in ensuring timely and reliable food deliveries.

Technical description – example tasks

Route Optimization Implementation
Implement a route optimization mechanism that calculates the most efficient delivery order for multiple destinations, taking into account distance, estimated travel time, and configurable delivery constraints (e.g. time windows or priority orders).

Integration with Maps and GPS Services
Integrate the mobile application with a mapping and GPS service to provide real-time navigation, location tracking, and dynamic route updates based on current traffic conditions.
