# Habit Tracker API Documentation

All API responses follow a unified structure.

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Specific error message",
  "status": 400
}
```

---

## 1. Authentication Module
Base Path: `/api/auth`

| Endpoint | Method | Description | Protected |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Register a new user | No |
| `/login` | `POST` | Authenticate and get tokens | No |
| `/refresh-token` | `POST` | Get new access token | No |
| `/me` | `GET` | Get current user info | Yes |
| `/logout` | `POST` | Invalidate refresh token | Yes |

---

## 2. Habits Module
Base Path: `/api/habits`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `POST` | Create a new habit |
| `/` | `GET` | List all habits (filter: `status`, sort: `name|recent`) |
| `/{id}` | `GET` | Get habit details + dynamic metrics |
| `/{id}` | `PATCH` | Update habit configuration |
| `/{id}` | `DELETE` | Delete habit and history |
| `/{id}/pause` | `PATCH` | Pause a habit |
| `/{id}/resume` | `PATCH` | Resume a paused habit |
| `/{id}/archive` | `PATCH` | Archive a habit |

---

## 3. Check-Ins Module
Base Path: `/api`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/habits/{id}/check-ins` | `PUT` | Upsert check-in for a date (within last 7 days) |
| `/habits/{id}/check-ins` | `GET` | Get paginated check-in history |
| `/check-ins/{checkInId}` | `DELETE` | Delete a specific check-in |

---

## 4. Exceptions Module
Base Path: `/api`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/habits/{id}/exceptions` | `POST` | Add a new exception for a habit |
| `/habits/{id}/exceptions` | `GET` | List all exceptions for a habit |
| `/exceptions/{id}` | `PUT` | Update an exception's date or reason |
| `/exceptions/{id}` | `DELETE` | Delete an exception |

---

## 5. Reminders Module
Base Path: `/api/habits/{habitId}/reminder`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `PUT` | Create or update a reminder for a habit |
| `/` | `GET` | Get current reminder for a habit |
| `/` | `DELETE` | Delete the reminder for a habit |

---

## 6. Dashboard Module
Base Path: `/api/dashboard`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Get summary of active habits, badges, and progress |
| `/due` | `GET` | Get list of habits scheduled for today |

---

## 7. Badges Module
Base Path: `/api/badges`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | List all available badges and user's earned status |

---

## Data Enums Reference

- **TargetType**: `YES_NO`, `COUNT`
- **ScheduleType**: `DAILY`, `SPECIFIC_DAYS`, `WEEKLY_COUNT`
- **HabitStatus**: `ACTIVE`, `PAUSED`, `ARCHIVED`
- **CheckInStatus**: `DONE`, `PARTIAL`, `SKIPPED`
- **DayOfWeek**: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`
