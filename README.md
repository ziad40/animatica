# Animatica Frontend

A modern, interactive React-based frontend for learning Operating System scheduling algorithms with AI-powered assistance and real-time visualization.

**Backend Repository**: [animatica-Express](https://github.com/ziad40/animatica-Express) | **GitHub Profile**: [ziad40](https://github.com/ziad40)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Build & Deployment](#build--deployment)
- [Key Components](#key-components)
- [Services](#services)
- [Pages](#pages)
- [2D & 3D Playground](#2d--3d-playground)
- [Analysis & Visualization](#analysis--visualization)
- [Dependencies](#dependencies)

## 🎯 Project Overview

Animatica is an educational web application designed to teach Operating System concepts, specifically CPU scheduling algorithms. The platform provides:

- **Interactive Problem Solving**: Solve scheduling algorithm problems with real-time feedback
- **AI-Powered Assistance**: Get hints and explanations using OpenAI integration
- **Visual Learning**: 2D and 3D visualizations of algorithm execution
- **Progress Tracking**: Monitor learning progress with detailed analytics
- **Role-Based Access**: Separate interfaces for students and teachers
- **Real-Time Analysis**: View performance metrics and improvement areas

## ✨ Features

### For Students

1. **Problem Solving Interface**
   - Access dynamically generated scheduling problems
   - Support for multiple algorithm types: FCFS, SJF, Priority, Round Robin, SRTF
   - Real-time answer validation and scoring
   - Time tracking for each attempt

2. **Interactive Visualizations**
   - 2D timeline visualization of task scheduling
   - 3D process visualization for better understanding
   - Real-time algorithm execution display

3. **AI Assistant**
   - Ask questions about specific problems
   - Receive contextual hints for incorrect answers
   - Get explanations in simple, learning-focused language
   - Conversation history for reference

4. **Progress Tracking**
   - View attempt history with detailed analytics
   - Track performance across different algorithm types
   - Monitor time improvements
   - Visual progress charts and statistics

5. **User Dashboard**
   - View recent attempts
   - See performance summary
   - Quick access to practice problems
   - Profile management

### For Teachers

1. **Student Management**
   - View all enrolled students
   - Access detailed individual student analytics
   - Track class-wide statistics

2. **Analytics Dashboard**
   - Overall class performance metrics
   - Individual student progress visualization
   - Question-specific performance analysis
   - Detailed attempt analysis per student

3. **Performance Insights**
   - View student attempts with submitted answers
   - Compare student solutions against correct solutions
   - Identify struggling areas
   - Track improvement over time

4. **Class Statistics**
   - Aggregate performance metrics
   - Popular problem types
   - Average completion times
   - Overall success rates

## 🛠 Tech Stack

### Frontend Framework & Build Tools
- **React 19.2.0** - UI library
- **Vite 7.1.6** - Modern build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing

### Styling & UI
- **TailwindCSS 3.4.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS transformations
- **Autoprefixer 10.4.21** - Vendor prefix automation

### Utilities & Libraries
- **Axios 1.12.2** - HTTP client for API requests
- **React Markdown 10.1.0** - Markdown rendering
- **KaTeX 0.16.27** - Mathematical equation rendering
- **Rehype KaTeX 7.0.1** - KaTeX for markdown
- **Remark GFM 4.0.1** - GitHub-flavored markdown support
- **Remark Math 6.0.0** - Math notation support for markdown

### Visualization & Graphics
- **Three.js 0.180.0** - 3D graphics library
- **Recharts 3.6.0** - React charting library
- **Lucide React 0.546.0** - Icon library

### Authentication & Security
- **JWT Decode 4.0.0** - JSON Web Token parsing
- **OpenAI 6.7.0** - AI integration client

## 📁 Project Structure

```
src/
├── main.jsx                 # Application entry point with routing
├── style.css               # Global styles
├── api/
│   └── axiosInstance.js    # Configured Axios instance for API calls
├── assets/
│   ├── gif/                # Animated GIFs
│   └── images/             # Static images
├── components/
│   ├── layout/
│   │   ├── Header.jsx      # Navigation header component
│   │   ├── Interactive.jsx # Interactive problem container
│   │   ├── Playground.jsx  # Practice environment
│   │   ├── Problem.jsx     # Problem display component
│   │   ├── Solution.jsx    # Solution display component
│   │   ├── ThreeDInteractive.jsx    # 3D visualization wrapper
│   │   └── TwoDInteractive.jsx      # 2D visualization wrapper
│   └── ui/
│       ├── ActionButton.jsx         # Reusable action button
│       ├── Assistant.jsx            # AI assistant component
│       ├── AttemptDetails.jsx       # Attempt history display
│       ├── Avatar.jsx               # User avatar component
│       ├── chatAI.jsx               # AI chat interface
│       ├── dropDown.jsx             # Dropdown selector
│       ├── Line3D.js                # 3D line rendering
│       ├── numberInput.jsx          # Number input field
│       ├── passwordInput.jsx        # Password input field
│       ├── problemViewer.jsx        # Problem visualization
│       ├── ProcessBox3D.js          # 3D process visualization
│       ├── ProgressChart.jsx        # Progress visualization
│       ├── QuestionDetails.jsx      # Question information display
│       ├── switch.jsx               # Toggle switch component
│       ├── timelineDrawer.jsx       # Timeline visualization
│       └── waitingTimeTable.jsx     # Performance metrics table
├── context/
│   ├── OverlayContextCard.jsx       # Overlay UI state management
│   └── UserContext.jsx              # Global user state management
├── pages/
│   ├── Dashboard.jsx       # Main dashboard page
│   ├── Login.jsx          # User login page
│   ├── Register.jsx       # User registration page
│   ├── StudentHistory.jsx # Student attempt history
│   └── TeacherDashboard.jsx       # Teacher analytics dashboard
└── services/
    ├── analysisService.js  # Analytics API calls
    ├── assistant.js        # AI assistant service
    ├── authService.js      # Authentication service
    ├── problemService.js   # Problem management service
    └── userService.js      # User management service
```

## 💻 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend server running (animatica-Express)

### Steps

1. **Clone the repository**
   ```bash
   cd animatica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.development` or `.env.production`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

## 🚀 Getting Started

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at **`http://localhost:5173`** (Frontend runs on port 5173).

**Important**: Ensure the backend is running on port 5000 for the frontend to connect properly. See the [Backend Repository](https://github.com/ziad40/animatica-Express) for backend setup instructions.

### Features Available in Development

- Hot Module Replacement (HMR) for instant updates
- Full source maps for debugging
- Development API calls to local backend

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔧 Environment Configuration

### Development Environment (.env.development)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Port Configuration**:
- Frontend: `5173` (Vite dev server)
- Backend: `5000` (Express API server)
- Both must be running for full functionality

### Production Environment (.env.production)

```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

## 📦 Build & Deployment

### Build Process

1. **Transpilation**: ES6+ code is transpiled to compatible JavaScript
2. **Bundling**: Assets are bundled and minified
3. **Optimization**: Code splitting for better performance
4. **Output**: Static files in `dist/` directory

### Deployment

The `dist/` directory contains static files that can be deployed to:
- Vercel
- Netlify
- Any static hosting service
- Or served by the backend Express server

## 🧩 Key Components

### Layout Components

#### Header.jsx
- Navigation bar with route links
- User authentication status display
- Role-based menu items

#### Interactive.jsx
- Container for interactive problem-solving
- Manages problem state and interactions
- Handles visualization switching

#### Playground.jsx
- Practice environment for solving problems
- Problem generator interface
- Timer and submission controls

#### Problem.jsx
- Displays the current problem statement
- Shows problem parameters
- Provides input fields for solutions

#### Solution.jsx
- Shows the correct solution
- Explains the solution steps
- Compares with student attempt

#### ThreeDInteractive.jsx / TwoDInteractive.jsx
- Visualization switchers
- Render algorithm execution visually
- Update in real-time based on data

### UI Components

#### ActionButton.jsx
- Reusable button component
- Customizable styles and states
- Loading and disabled states

#### Assistant.jsx
- AI assistant panel
- Displays hints and explanations
- Manages conversation history

#### ProgressChart.jsx
- Visual representation of progress
- Multiple chart types (line, bar)
- Real-time data updates

#### QuestionDetails.jsx
- Detailed question information
- Shows problem context
- Displays constraints and requirements

#### AttemptDetails.jsx
- Displays attempt history
- Shows scores and timing
- Provides detailed analysis

### Visualization Components

#### Line3D.js
- Renders 3D lines for process visualization
- Uses Three.js for rendering
- Supports animation

#### ProcessBox3D.js
- 3D visualization of processes
- Shows CPU allocation over time
- Interactive camera controls

#### timelineDrawer.jsx
- 2D timeline representation
- Shows process scheduling order
- Highlights current execution

#### waitingTimeTable.jsx
- Performance metrics table
- Waiting times for each process
- Turnaround times calculation

## 🔗 Services

### authService.js

Handles user authentication operations:

- **login(email, password)** - User login, returns JWT token
- **register(name, email, password, fullName)** - User registration
- **logout()** - Clears authentication token
- **getToken()** - Retrieves stored JWT token

### problemService.js

Manages problem retrieval and submission:

- **getProblem(type)** - Fetches a problem of specific algorithm type
- **submitSolution(questionId, question, trialAnswer, time)** - Submits solution for evaluation

### assistant.js

AI assistant operations:

- Get hints for incorrect answers
- Ask general questions about problems
- Retrieve conversation history

### analysisService.js

Teacher analytics operations:

- **getAllStudents()** - Retrieves all enrolled students
- **getAllStudentsStatistics()** - Gets aggregate class statistics
- **getStudentAnalysis(username)** - Detailed analysis for individual student
- **getStudentQuestionAnalysis(username, questionId)** - Specific question analysis

### userService.js

User profile and system management:

- Update user profile
- Retrieve user information
- Manage user preferences

## 🎮 2D & 3D Playground

The Animatica platform provides dual visualization modes for understanding CPU scheduling algorithms:

### 2D Playground (Timeline Visualization)

**Location**: `components/ui/timelineDrawer.jsx` & `components/layout/TwoDInteractive.jsx`

**Features**:
- **Linear Timeline Display**: Shows processes in execution order over time
- **Time Axis**: Horizontal axis representing passage of time
- **Process Blocks**: Visual blocks representing each process execution period
- **Color Coding**: Different processes shown in different colors for easy distinction
- **Waiting Time Display**: Visual indication of process waiting periods
- **Turnaround Time Calculation**: Total time from arrival to completion shown for each process

**How It Works**:
1. Student submits their answer to a scheduling problem
2. Backend calculates the correct scheduling sequence
3. Frontend renders the timeline showing:
   - When each process starts (arrival time)
   - When each process executes (execution period)
   - When each process completes (completion time)
   - Gaps showing when CPU is idle or other processes run

**Interactive Features**:
- Hover over process blocks to see detailed timing information
- View metrics for each process (waiting time, turnaround time, burst time)
- Compare student's timeline with correct solution side-by-side

### 3D Playground (Process Visualization)

**Location**: `components/ui/ProcessBox3D.js`, `components/ui/Line3D.js` & `components/layout/ThreeDInteractive.jsx`

**Technology**: Three.js 0.180.0 - 3D Graphics Library

**Features**:
- **3D Process Boxes**: Each process represented as a 3D box in space
- **Spatial Representation**: Process execution shown in 3D coordinate space
- **Z-axis Timeline**: Depth axis representing time progression
- **Dynamic Animation**: Smooth transitions as processes execute
- **Interactive Camera**: Rotate, zoom, and pan the 3D view
- **Real-time Updates**: Visualization updates as algorithm executes
- **Color-Coded Processes**: Distinct colors for each process for clarity

**3D Components**:
- **ProcessBox3D.js**: Renders individual 3D boxes representing processes with their execution periods
- **Line3D.js**: Draws connecting lines showing process relationships and state transitions

**How It Works**:
1. Problem data is loaded and passed to 3D visualization engine
2. Three.js scene initializes with camera, lights, and renderer
3. For each process:
   - A 3D box is created with dimensions representing timing
   - Position on Z-axis represents time
   - Color represents process ID
   - Lines connect related processes
4. Animation plays showing CPU scheduling in 3D space
5. User can interact with scene (rotate, zoom) to better understand the algorithm

**Educational Benefits**:
- Better spatial understanding of complex algorithms
- Visual representation of concurrent process execution
- Clear visualization of context switching
- Enhanced learning through different perspectives

### Switching Between 2D and 3D

**User Interface**:
- Toggle buttons in the problem-solving interface
- TwoDInteractive.jsx and ThreeDInteractive.jsx handle the switching
- View state maintained during switches
- Both views show the same problem data

**Component Structure**:
```
Interactive.jsx (Main Container)
├── 2D Mode
│   └── TwoDInteractive.jsx
│       ├── timelineDrawer.jsx
│       └── waitingTimeTable.jsx
└── 3D Mode
    └── ThreeDInteractive.jsx
        ├── ProcessBox3D.js
        └── Line3D.js
```

## 📊 Analysis & Visualization

### Student Performance Analytics

**Components Involved**:
- `ProgressChart.jsx`: Main analytics visualization
- `AttemptDetails.jsx`: Detailed attempt information
- `QuestionDetails.jsx`: Problem-specific analysis

**Metrics Displayed**:
1. **Accuracy Rate**: Percentage of correctly solved problems
2. **Average Score**: Mean score across all attempts
3. **Time Tracking**: Average time taken per problem type
4. **Improvement Trend**: Progress visualization over time
5. **Algorithm Breakdown**: Performance by algorithm type (FCFS, SJF, Priority, Round Robin, SRTF)

**Data Collection**:
- Each attempt tracked with:
  - Problem type solved
  - Student's answer
  - Calculated score
  - Time taken
  - Timestamp of attempt

**Frontend Analytics Display**:
```javascript
// StudentHistory.jsx retrieves and displays:
- Total attempts made
- Success/failure statistics
- Performance trends
- Problem type distribution
- Time-based improvements
```

### Teacher Dashboard Analytics

**Location**: `pages/TeacherDashboard.jsx`

**Features**:
1. **Class Statistics**:
   - Total students enrolled
   - Average class performance
   - Problem type popularity
   - Overall success rates

2. **Individual Student Analytics**:
   - Student performance summary
   - Attempt history with detailed breakdown
   - Strong and weak areas identification
   - Progress trajectory

3. **Question-Specific Analysis**:
   - Which problems students struggle with
   - Average attempts needed per problem
   - Success rates by algorithm type
   - Time analysis for each problem

4. **Visual Representations**:
   - `ProgressChart.jsx`: Line graphs showing trends
   - `waitingTimeTable.jsx`: Comparison tables
   - Custom metrics visualization

**Data Flow in Analysis**:
```
User (Teacher) → TeacherDashboard.jsx
    ↓
Fetches from analysisService.js
    ↓
Backend API (GET /api/teacher/students)
    ↓
Receives aggregated statistics
    ↓
Displays in UI components
    ↓
Visualizations rendered with Recharts
```

### Recharts Integration

The frontend uses **Recharts** (v3.6.0) for rendering interactive charts:

**Chart Types Used**:
- **LineChart**: Showing performance trends over time
- **BarChart**: Comparing performance across problem types
- **PieChart**: Showing distribution of attempted problems
- **AreaChart**: Cumulative performance visualization

**Features**:
- Responsive design adapts to screen size
- Tooltip on hover showing detailed information
- Legend for identifying data series
- Smooth animations for data transitions
- Customizable colors and styling

## 📚 Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI library |
| react-dom | 19.2.0 | React DOM rendering |
| react-router-dom | 7.9.4 | Client-side routing |
| vite | 7.1.6 | Build tool |
| axios | 1.12.2 | HTTP requests |
| three | 0.180.0 | 3D graphics |
| recharts | 3.6.0 | Charts & graphs |
| tailwindcss | 3.4.18 | Styling |
| katex | 0.16.27 | Math rendering |
| react-markdown | 10.1.0 | Markdown display |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-react | 5.0.4 | React support for Vite |
| postcss | 8.5.6 | CSS processing |
| autoprefixer | 10.4.21 | Vendor prefixes |

## 🎨 Styling

The application uses **TailwindCSS** for styling with a utility-first approach:

- Responsive design for mobile, tablet, and desktop
- Dark mode support ready
- Custom color scheme defined in `tailwind.config.js`
- CSS modules via PostCSS for component-specific styles

## 🔐 Authentication

- JWT-based authentication
- Token stored in browser localStorage
- Automatic token refresh handling
- Role-based access control (Student/Teacher/Admin)

## 📊 Data Flow

```
User Input → Component State → API Service → Backend API
                    ↓
              UI Update ← Response Data
```

## 🐛 Troubleshooting

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify `VITE_API_BASE_URL` is correct
2. Ensure backend server is running on the specified port
3. Check CORS settings on the backend
4. Verify network connectivity

### Build Issues

If the build fails:

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf dist && npm run build`
3. Check Node.js version: `node --version` (should be 16+)

## 📝 License

ISC License - See LICENSE file for details

## 👤 Author

**Ziad Abuelkher**
- GitHub: [@ziad40](https://github.com/ziad40)
- Repository: [Animatica Frontend](https://github.com/ziad40/animatica)
- Backend: [Animatica Express](https://github.com/ziad40/animatica-Express)

## 🔗 Related Projects

- **Backend API**: [animatica-Express](https://github.com/ziad40/animatica-Express) - Express.js backend running on port 5000
- **Frontend**: [animatica](https://github.com/ziad40/animatica) - React frontend running on port 5173

## 📞 Support

For issues and questions, please refer to the project repository issues section:
- Frontend Issues: [github.com/ziad40/animatica/issues](https://github.com/ziad40/animatica/issues)
- Backend Issues: [github.com/ziad40/animatica-Express/issues](https://github.com/ziad40/animatica-Express/issues)
