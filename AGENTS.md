# Tailor Management API Instructions

## Project stack

- NestJS
- TypeScript strict mode
- MongoDB with Mongoose
- Swagger
- class-validator
- JWT authentication

## Working rules

- Preserve existing working code.
- Do not modify unrelated modules.
- Complete only the requested checkpoint.
- Do not create duplicate files or modules.
- Use relative imports.
- Use DTO validation.
- Add Swagger decorators to public endpoints.
- Never store plain-text passwords.
- Never expose passwordHash in API responses.
- Do not delete MongoDB data.
- Do not modify .env values.
- Do not disable TypeScript strict checks.
- Do not use `any` unless absolutely necessary.

## Required verification

After making changes, run:

1. npm run build
2. npm run lint

Fix only errors caused by the current task.

## Reporting

At the end, report:

- Files created
- Files modified
- Packages installed
- Commands run
- Tests performed
- Any remaining issues