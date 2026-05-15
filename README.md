# Habit Tracker Application

## 1. Project Overview
The **Habit Tracker** is a comprehensive personal productivity application designed to help users build and maintain consistent habits. It goes beyond simple "Done/Undone" tracking by offering flexible scheduling, granular progress metrics, and a gamified experience.

Key features include:
- **Custom Habits**: Create habits with specific categories and descriptions.
- **Flexible Scheduling**: Define habits as Daily, on Specific Weekdays, or as a Weekly Count target.
- **Dual Target Types**: Support for simple Yes/No habits or quantifiable "Count" habits (e.g., "Drink 8 glasses of water").
- **Smart Check-ins**: Log progress as Done, Partial, or Skipped.
- **Exception Handling**: Add "Exceptions" for days when life gets in the way, preserving your streaks.
- **In-App Reminders**: Configure specific times to get notified about pending habits.
- **Analytics & Gamification**: Track current and longest streaks, view completion rates via interactive charts, and earn badges for consistency.

---

## 2. Setup & Run Instructions

### Prerequisites
- **Java 21**
- **Maven** (or use the included `./mvnw`)
- **Node.js** (v18+) & **npm**
- **SQL Server** (Local instance)

### Backend Setup
1. **Database Creation**: Create a database named `habitTracker` in your SQL Server instance.
2. **Configuration**: Update `backend/src/main/resources/application.properties` with your SQL Server credentials if different from the default:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost;databaseName=habitTracker;encrypt=true;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=Welcome@1234
   ```
3. **Run Backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   The backend will be available at: `http://localhost:8080`

### Frontend Setup
1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Run Frontend**:
   ```bash
   npm run dev
   ```
   The frontend will be available at: `http://localhost:5173`

---

## 3. Tech Stack & Rationale
- **Backend**: 
  - **Spring Boot**: Chosen for its robust ecosystem and rapid development of REST APIs.
  - **Spring Security & JWT**: Provides stateless authentication and secure API access.
  - **JPA/Hibernate**: Simplifies database interactions and ensures type-safe persistence.
- **Frontend**: 
  - **React & TypeScript**: Ensures a responsive UI with strict type safety for fewer runtime errors.
  - **Vite**: Provides an extremely fast development environment and build tool.
  - **Framer Motion**: Used for premium, smooth UI transitions and micro-animations.
  - **Recharts**: For clean, interactive data visualization of habit performance.
- **Database**: **SQL Server** for enterprise-grade relational data management.
- **Security**: **BCrypt** for industry-standard password hashing.

---

## 4. Architectural Overview
### Backend Organization
- **Controllers**: Handle REST endpoints and request mapping.
- **Services**: Contain business logic, streak calculations, and badge awarding rules.
- **Repositories**: Interface with SQL Server using Spring Data JPA.
- **Entities**: JPA models representing the database schema.
- **DTOs**: Data Transfer Objects for clean API request/response structures.
- **Security**: Custom JWT filters and authentication providers.

### Frontend Organization
- **Features**: Modularized code organized by domain (Auth, Habits, Dashboard, Badges).
- **Hooks**: Custom React hooks for data fetching (using TanStack Query) and state management.
- **API Services**: Axios-based clients for backend communication.
- **Components**: Atomic UI components (Buttons, Cards, Modals) and Layout wrappers.
- **Types**: Centralized TypeScript interfaces matching backend DTOs.

---

## 5. Features Implemented
- **Authentication**: Full Register/Login flow with JWT-based session persistence.
- **Data Isolation**: All habits and metrics are strictly isolated per user.
- **Habit CRUD**: Full management of habit lifecycle (Create, Read, Update, Delete).
- **Target Types**: 
  - **Yes/No**: Simple binary completion.
  - **Count**: Numeric targets with customizable units (e.g., minutes, pages).
- **Schedules**:
  - **Daily**: Every single day.
  - **Specific Days**: Only on selected days of the week.
  - **Weekly Count**: Targets a specific number of completions per week.
- **Check-ins**: 
  - **Done**: Fully completed.
  - **Partial**: Progress made but goal not fully met (for Count habits).
  - **Skipped**: Logged as skipped (doesn't break streaks if documented).
- **Exceptions**: Log specific dates as "Exceptions" (e.g., Sick days) to protect streaks.
- **Metrics**: Real-time calculation of Current Streak, Longest Streak, and Completion Rate.
- **Dashboard**: "Today's Pulse" view showing habits due today and progress bars.
- **Badges**: Automatic awarding of achievements based on performance.

---

## 6. Badge Criteria
The system automatically evaluates and awards the following badges:
- **First Steps**: Awarded upon recording your very first habit check-in.
- **Consistency King**: Awarded for achieving a **7-day streak** on any active habit.
- **Habit Master**: Awarded for achieving a **30-day streak** on any active habit.
- **Century**: Awarded when you reach **100 total completions** across all habits.

---

## 7. Data Model Summary
- **Users**: Authentication details and profile info.
- **Habits**: Core habit definitions (name, schedule, target, status).
- **Check-ins**: Daily logs of progress with status and value.
- **Habit Exceptions**: Logged "free passes" for specific dates.
- **Reminders**: Time-based configurations for in-app alerts.
- **Badges**: Definition of available achievements.
- **User_Badges**: Mapping of which users have earned which badges and when.
- **Refresh_Tokens**: Managed tokens for extended secure sessions.

---

## 8. Validation Rules
- **Habit Name**: Required and must be non-blank.
- **Count Habits**: Must specify a positive `targetValue` and a `unit`.
- **Specific Days**: Must select at least one weekday.
- **Weekly Count**: Target must be between 1 and 7.
- **Reminders**: Time must be in valid `HH:mm` format.
- **Check-ins**: Cannot be logged for future dates.
- **Backdating**: Check-ins can be logged/edited for the past 7 days to ensure data integrity.

---

## 9. Security Notes
- **Password Hashing**: All user passwords are encrypted using BCrypt before storage.
- **JWT Protection**: All `/api/**` endpoints (except Auth) require a valid Bearer token.
- **Ownership Verification**: Every service call verifies that the requested resource (Habit, Check-in, etc.) belongs to the currently authenticated user.
- **Secrets Management**: Sensitive values like the JWT Secret are managed via `application.properties` (and should be environment variables in production).

---

## 10. How AI Tools Were Used
- **AI Assistant**: Antigravity (powered by Gemini 3 Flash).
- **Assistance Scope**: 
  - Boilerplate generation for JPA entities and DTOs.
  - Assistance with complex streak calculation logic in the backend.
  - UI styling suggestions and Framer Motion animation configurations.
  - Documentation generation (including this README).
- **Verification**: All AI-generated code was manually reviewed, debugged, and tested against local SQL Server and browser environments. Corrections were made to streak reset logic and date handling.

---

## 11. Assumptions
- **Local Execution**: The app is designed to run in a local development environment.
- **Reminders**: Reminders are currently "In-App" visibility flags; no email/SMS integration is implemented.
- **Timezone**: The application assumes the user's local browser timezone matches the server's local time for date calculations.
- **Single User**: Designed as a personal tool; no social or "Follower" features are included.

---

## 12. Trade-offs
- **Deprioritized**: 
  - **External Notifications**: Push notifications were traded for a robust in-app reminder system due to the local-only scope.
  - **Complex Calendar**: A simplified 7-day rolling view was implemented instead of a full monthly calendar to focus on immediate habit consistency.
- **Known Limitations**: Streaks are calculated on-the-fly; for very large datasets (thousands of check-ins), performance optimization on the DB query might be required.

---

## 13. Testing
Manual verification was performed for:
- User registration and JWT login/logout flow.
- Habit creation with all schedule types (Daily, Specific Days, Weekly Count).
- Streak increments upon daily check-ins and resets upon missed days.
- Streak preservation when an "Exception" is logged for a missed day.
- Automated badge awarding when criteria (e.g., 7-day streak) are met.

---

## 14. Future Work
- **Advanced Analytics**: Monthly and yearly heatmap visualizations.
- **Data Export**: Export habit history to CSV or JSON.
- **Dockerization**: Containerize the app for easier deployment.
- **Timezone Support**: Implement UTC-based storage with local offset conversion.

---

## 15. Known Issues / Limitations
- **Critical Issues**: None. All core CRUD and metric features are fully functional.
- **Minor**: The "Today's Progress" percentage on the dashboard may take a moment to refresh after a check-in (requires a quick page re-sync or manual refresh).
