# Internal JavaScript Contract

## `submitComplaint(title, content, author)`
- **Description**: Handles a new complaint submission, stores it in `localStorage`, and triggers AI generation.
- **Parameters**: `title: String`, `content: String`, `author: String`.
- **Returns**: `Promise<ComplaintObject>`.

## `generateAIResponse(complaint)`
- **Description**: Calls the Gemini API (or a mock) and returns a solution-oriented response.
- **Parameters**: `complaint: ComplaintObject`.
- **Returns**: `Promise<AIResponseObject>`.

## `maskPII(text)`
- **Description**: Replaces sensitive info (emails, names, phone numbers) with asterisks.
- **Parameters**: `text: String`.
- **Returns**: `String`.
