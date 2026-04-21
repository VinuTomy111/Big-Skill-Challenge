# The Big Skill Challenge

## 📖 Project Summary
The Big Skill Challenge is a dynamic competition platform where users can engage in knowledge-based quizzes and creative text battles. The ecosystem uses a robust, scalable backend architecture for high-volume traffic handling, an AI microservice to process free-text submissions for fraud and sentiment, and a seamless mobile application for end users.

The project is structured into three distinct modules:
1. **Backend**: Built with .NET 9 adopting Clean Architecture and CQRS (MediatR), backed by Entity Framework Core and SQL Server.
2. **AI Service**: A Python-based FastAPI microservice responsible for real-time validation, sentiment analysis, and fraud detection on creative 25-word text entries.
3. **Mobile App**: A cross-platform mobile client built using React Native and Expo, incorporating modern UI/UX principles, navigation, and state caching.

---

## 🚀 How to Run the Ecosystem

### 1. Database (SQL Server)
The core database is managed via SQL Server and EF Core migrations.
**Requirements:**
- SQL Server (LocalDB or Docker instance)
- SSMS or Azure Data Studio (Optional, for viewing data)

**Setup:**
1. Navigate to the `db` directory if you wish to run the raw schema manually:
   `sqlcmd -S localhost -U sa -P YourPassword -i schema.sql`
*(Alternatively, simply run the .NET Backend, and EF Core will automatically run `EnsureCreated()` to build the database).*

### 2. Backend (.NET 9 Web API)
**Requirements:**
- .NET 9 SDK
- User Secrets or `appsettings.Development.json` configured for SQL connection strings & JWT keys.

**Setup & Run:**
1. Navigate to the backend application folder:
   ```bash
   cd backend/TheBigSkillChallenge.API
   ```
2. Restore NuGet dependencies and build:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
*The API will typically launch on `https://localhost:5001` or `http://localhost:5000` with Swagger available at `/swagger`.*

### 3. AI Validation Service (FastAPI)
**Requirements:**
- Python 3.10+
- `pip` package manager

**Setup & Run:**
1. Navigate to the AI service directory:
   ```bash
   cd ai-service
   ```
2. Create and activate a Virtual Environment (Recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Uvicorn server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
*The FastAPI docs will be available at `http://localhost:8000/docs`.*

### 4. Mobile App (React Native Expo)
**Requirements:**
- Node.js (v18+)
- npm or yarn
- Expo Go App on your physical device (or Android Studio/Xcode for emulators)

**Setup & Run:**
1. Navigate to the mobile app folder:
   ```bash
   cd mobile-app
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Expo bundler:
   ```bash
   npm start
   ```
4. Press `a` to run on an Android emulator, `i` to run on an iOS simulator, or scan the QR code with the Expo Go app on your physical mobile device.


### Core Concept
"The Big Skill Challenge is designed to test users through rapid-fire time-constrained quizzes and creative short-text submissions. Competitors can join organized challenges, answer dynamically randomized questions, and submit a 25-word creative entry."

### Engineering & Architecture Highlights
1. **Clean Architecture & CQRS:**
   - **Why we used it:** The .NET backend is strictly separated into Domain, Application, Infrastructure, and API layers. We employed MediatR to enforce the CQRS (Command Query Responsibility Segregation) pattern. This completely decouples our reading data logic from our write-heavy transactions, allowing the platform to scale natively without controller bloat.
2. **AI Microservice Integration:**
   - **Why we used it:** Validating arbitrary user creativity manually is impossible at scale. By offloading this to an isolated Python microservice, our heavy .NET backend doesn't suffer from AI processing bottlenecks. The lightweight FastAPI service analyzes text for sentiment and flags invalid structural entries.
3. **Cross-Platform Interface:**
   - **Why we used it:** Expo lets us write TypeScript logic once and deploy high-performance user interfaces natively to both iOS and Android simultaneously, complete with local SecureStorage for JWT token maintenance.

