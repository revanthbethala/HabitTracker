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

### Request/Response Structures

#### **POST /register**
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response Data**: `null` (Message: "User registered successfully")

#### **POST /login**
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response Data**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "refreshToken": "550e8400-e29b..."
  }
  ```

#### **POST /refresh-token**
- **Request Body**:
  ```json
  {
    "refreshToken": "550e8400-e29b..."
  }
  ```

---

## 2. Habits Module
Base Path: `/api/habits`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `POST` | Create a new habit |
| `/` | `GET` | List all habits (filter: `status`, sort: `name\|recent`) |
| `/{id}` | `GET` | Get habit details + dynamic metrics |
| `/{id}` | `PATCH` | Update habit configuration |
| `/{id}` | `DELETE` | Delete habit and history |
| `/{id}/pause` | `PATCH` | Pause a habit |
| `/{id}/resume` | `PATCH` | Resume a paused habit |
| `/{id}/archive` | `PATCH` | Archive a habit |

### Request/Response Structures

#### **POST /habits**
- **Request Body**:
  ```json
  {
    "name": "Morning Run",
    "description": "5km run in the park",
    "category": "Health",
    "targetType": "YES_NO", // or COUNT
    "targetValue": 1,
    "unit": "times",
    "scheduleType": "DAILY", // or SPECIFIC_DAYS, WEEKLY_COUNT
    "weekdays": ["MONDAY", "WEDNESDAY", "FRIDAY"], // if SPECIFIC_DAYS
    "weeklyTarget": 3, // if WEEKLY_COUNT
    "startDate": "2024-05-15",
    "endDate": null
  }
  ```

#### **GET /habits/{id} (Response Data)**
```json
{
  "id": 1,
  "name": "Morning Run",
  "status": "ACTIVE",
  "currentStreak": 5,
  "longestStreak": 12,
  "completionRate": 85,
  "totalCompletions": 45,
  "todayStatus": "PENDING", // PENDING, DONE, SKIPPED
  "lastCheckIn": "2024-05-14"
}
```

---

## 3. Check-Ins Module
Base Path: `/api`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/habits/{id}/check-ins` | `PUT` | Upsert check-in for a date (within last 7 days) |
| `/habits/{id}/check-ins` | `GET` | Get paginated check-in history |
| `/check-ins/{checkInId}` | `DELETE` | Delete a specific check-in |

### Request/Response Structures

#### **PUT /habits/{id}/check-ins**
- **Request Body**:
  ```json
  {
    "date": "2024-05-15",
    "status": "DONE", // DONE, PARTIAL, SKIPPED
    "value": 1,
    "note": "Felt great!"
  }
  ```
- **Response Data**: Returns the updated Habit object with new metrics.

---

## 4. Dashboard & Badges (Planned)
Base Path: `/api`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/dashboard` | `GET` | Summary of today's progress and stats |
| `/dashboard/due` | `GET` | List of habits scheduled for today but not yet done |
| `/badges` | `GET` | List of all badges with "earned" status |

---

## Data Enums Reference

- **TargetType**: `YES_NO`, `COUNT`
- **ScheduleType**: `DAILY`, `SPECIFIC_DAYS`, `WEEKLY_COUNT`
- **HabitStatus**: `ACTIVE`, `PAUSED`, `ARCHIVED`
- **CheckInStatus**: `DONE`, `PARTIAL`, `SKIPPED`
- **DayOfWeek**: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`
