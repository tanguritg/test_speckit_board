# Data Model: Customer Complaint Board

## Complaint Entity
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique UUID for the complaint. |
| title | String | User-provided summary. |
| content | String | Full text of the grievance. |
| author_masked | String | Masked version of the author's name/email. |
| timestamp | Number | Submission time (ms). |
| status | String | 'pending' | 'reviewed'. |
| ai_response_id | String | Reference to the linked AI response. |

## AI Response Entity
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique UUID for the response. |
| complaint_id| String | Reference to the complaint. |
| content | String | Generated response text. |
| model | String | 'Gemini' (or other LLM). |
| timestamp | Number | Generation time (ms). |
