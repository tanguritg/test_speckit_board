# Research Report: Customer Complaint Board (Vanilla JS)

## [RESEARCH-001] Client-side AI Integration
- **Decision**: For the prototype, we will use a direct client-side fetch to the Gemini API (using an API key provided by the environment/user during local testing) with a robust error-handling/fallback system.
- **Rationale**: Since we are avoiding dynamic backend elements (FastAPI), a direct client-side approach is the only way to demonstrate the live AI capability in a "static" app context.
- **Security Warning**: For a true production app, this key would be exposed; however, for this prototype, we will document how to use an `.env` or local proxy if needed.
- **Alternatives**: Mocking the AI response with static text (decided against to provide a functional prototype).

## [RESEARCH-002] PII Masking Patterns
- **Decision**: We will implement a client-side regex-based masking function (`maskPII`) that identifies common patterns (email, phone, name-like strings) and replaces them with asterisks before they are displayed in the "Public Board" view.
- **Rationale**: This adheres to "Strict Privacy" (Principle III) even in a frontend-heavy application.

## [RESEARCH-003] "Staff Review" Simulation
- **Decision**: We will add a "Staff View" toggle (protected by a simple localStorage flag or query parameter) that reveals additional controls on each board entry, allowing for status changes and editing.
- **Rationale**: This demonstrates the "Human-in-the-loop" (Principle IV) requirement without a complex permission system.
