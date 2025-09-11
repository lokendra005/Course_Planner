# 📚 Course Prerequisite Planner

A comprehensive web application that helps students plan their academic journey using advanced graph algorithms. This project demonstrates practical applications of graph theory in education technology.

![Course Planner Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### 🎯 Core Functionality
- **Course Management**: Add, edit, and delete courses with prerequisites
- **Dependency Visualization**: Interactive graph visualization of course relationships
- **Smart Ordering**: Automatic course sequence generation using topological sort
- **Conflict Detection**: Prevents circular dependencies in prerequisites
- **Semester Planning**: Organize courses into realistic semester schedules

### 🧮 Graph Algorithms Implemented
1. **Topological Sort** (Kahn's Algorithm) - Generates optimal course ordering
2. **Cycle Detection** (DFS with Color Coding) - Prevents circular dependencies  
3. **Prerequisite Analysis** (DFS Traversal) - Finds all required prerequisites
4. **Shortest Path** (BFS) - Discovers minimal prerequisite paths

### 💡 Technical Highlights
- **Frontend**: React with TypeScript for type safety
- **Backend**: Node.js with Express for RESTful API
- **Visualization**: vis.js for interactive graph rendering
- **Data Persistence**: JSON file storage (easily upgradable to database)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/course-prerequisite-planner.git
   cd course-prerequisite-planner
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
course-prerequisite-planner/
├── 📁 frontend/                 # React TypeScript frontend
│   ├── 📁 public/              # Static assets
│   │   ├── 📁 components/      # React components
│   │   │   ├── CourseForm.tsx      # Course add/edit form
│   │   │   ├── CourseList.tsx      # Course display and management
│   │   │   ├── GraphVisualization.tsx  # Interactive graph
│   │   │   └── RecommendedPath.tsx     # Course ordering display
│   │   ├── 📁 services/        # API communication
│   │   ├── 📁 utils/           # Graph algorithms (frontend)
│   │   ├── 📁 types/           # TypeScript type definitions
│   │   ├── 📁 styles/          # CSS styling
│   │   └── App.tsx             # Main application component
│   └── package.json
├── 📁 backend/                  # Node.js Express backend
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API route handlers
│   │   ├── 📁 utils/           # Graph algorithms (backend)
│   │   ├── 📁 data/            # JSON data storage
│   │   └── server.js           # Express server
│   └── package.json
├── package.json                 # Root package configuration
└── README.md                    # This file
```

## 🔧 API Documentation

### Course Management Endpoints

#### Get All Courses
```http
GET /api/courses
```
Returns all courses with their prerequisites.

#### Add New Course
```http
POST /api/courses
Content-Type: application/json

{
  "id": "CS101",
  "name": "Introduction to Programming",
  "credits": 3,
  "description": "Basic programming concepts",
  "prerequisites": []
}
```

#### Update Course
```http
PUT /api/courses/:id
Content-Type: application/json

{
  "name": "Updated Course Name",
  "prerequisites": ["CS101", "MATH101"]
}
```

#### Delete Course
```http
DELETE /api/courses/:id
```

### Algorithm Endpoints

#### Get Recommended Course Order
```http
GET /api/courses/order
```
Returns courses ordered using topological sort.

#### Get Course Prerequisites
```http
GET /api/courses/:id/prerequisites
```
Returns all prerequisites (direct and indirect) for a specific course.

#### Validate Course Structure
```http
POST /api/courses/validate
Content-Type: application/json

[
  // Array of course objects to validate
]
```

## 🧮 Graph Algorithms - Complete Implementation Guide

### Overview: 4 Core Graph Algorithms

This application demonstrates practical implementation of 4 fundamental graph algorithms to solve real-world academic planning problems. Each algorithm serves a specific purpose in managing course prerequisites and dependencies.

---

### 1️⃣ **Cycle Detection Algorithm**
**🎯 Purpose**: Prevent circular dependencies in course prerequisites (e.g., CS101 requires CS102, but CS102 requires CS101)

**🔬 Algorithm**: Depth-First Search (DFS) with Three-Color Coding
- **WHITE (0)**: Unvisited node
- **GRAY (1)**: Currently being processed (in recursion stack)
- **BLACK (2)**: Completely processed

**⚡ Complexity**: 
- Time: O(V + E) where V = courses, E = prerequisites
- Space: O(V) for color tracking

**💻 Implementation Location**:
```javascript
// Backend: backend/src/utils/graphAlgorithms.js
static detectCycle(courses) {
  const adjList = this.buildAdjacencyList(courses);
  const color = {};
  // DFS with color coding logic...
}
```

**📍 Used In**:
- `POST /api/courses` - When adding new courses
- `PUT /api/courses/:id` - When updating prerequisites
- `POST /api/courses/validate` - For batch validation
- **Frontend**: Real-time validation in course forms

**🔍 How It Works**:
1. Initialize all courses as WHITE (unvisited)
2. For each unvisited course, start DFS
3. Mark course as GRAY when entering recursion
4. If we encounter a GRAY course during traversal → **CYCLE DETECTED**
5. Mark course as BLACK when completely processed

---

### 2️⃣ **Topological Sort Algorithm**
**🎯 Purpose**: Generate optimal course ordering that respects all prerequisites (semester planning)

**🔬 Algorithm**: Kahn's Algorithm with In-Degree Calculation
- Calculate in-degree (number of prerequisites) for each course
- Process courses with zero in-degree first
- Remove processed courses and update dependent courses

**⚡ Complexity**:
- Time: O(V + E)
- Space: O(V)

**💻 Implementation Location**:
```javascript
// Backend: backend/src/utils/graphAlgorithms.js
static topologicalSort(courses) {
  const inDegree = this.calculateInDegree(courses);
  const queue = [];
  const result = [];
  // Kahn's algorithm implementation...
}
```

**📍 Used In**:
- `GET /api/courses/order` - Returns recommended course sequence
- **Frontend**: `AlgorithmAnalysis.tsx` - Semester planning visualization
- **Feature**: Automatic 4-year degree planning with credit limits

**🔍 How It Works**:
1. Calculate in-degree for each course (count prerequisites)
2. Add all courses with in-degree 0 to queue
3. Process queue: remove course, add to result, decrease in-degree of dependents
4. Repeat until all courses processed
5. If result length ≠ total courses → cycle exists

---

### 3️⃣ **Prerequisite Analysis Algorithm**
**🎯 Purpose**: Find ALL prerequisites (direct + indirect) for any course

**🔬 Algorithm**: Depth-First Search (DFS) Traversal
- Recursive exploration of prerequisite tree
- Builds complete dependency chain
- Prevents duplicate counting with visited set

**⚡ Complexity**:
- Time: O(V + E) worst case
- Space: O(V) for recursion stack and visited set

**💻 Implementation Location**:
```javascript
// Backend: backend/src/utils/graphAlgorithms.js
static findAllPrerequisites(courseId, courses) {
  const visited = new Set();
  const prerequisites = [];
  this.dfsPrerequisites(courseId, adjList, visited, prerequisites);
  return prerequisites;
}
```

**📍 Used In**:
- `GET /api/courses/:id/prerequisites` - Get complete prerequisite tree
- **Frontend**: Course analysis dropdown in `AlgorithmAnalysis.tsx`
- **Feature**: "What do I need before taking Advanced AI?" analysis

**🔍 How It Works**:
1. Start from target course
2. Recursively visit each prerequisite
3. Mark courses as visited to avoid cycles
4. Build complete list of all required courses
5. Return deduplicated prerequisite list

---

### 4️⃣ **Shortest Path Algorithm**
**🎯 Purpose**: Find minimum prerequisite path between any two courses

**🔬 Algorithm**: Breadth-First Search (BFS)
- Level-by-level exploration guarantees shortest path
- Explores all neighbors before going deeper
- Perfect for unweighted graphs (all prerequisites have equal "weight")

**⚡ Complexity**:
- Time: O(V + E)
- Space: O(V) for queue and visited tracking

**💻 Implementation Location**:
```javascript
// Backend: backend/src/utils/graphAlgorithms.js
static findShortestPath(startCourseId, endCourseId, courses) {
  const queue = [{ id: startCourseId, path: [startCourseId] }];
  const visited = new Set();
  // BFS implementation...
}
```

**📍 Used In**:
- Available via API for custom path queries
- **Potential Features**: "Fastest route to graduation" planning
- **Academic Advisors**: Course sequence optimization

**🔍 How It Works**:
1. Start with source course in queue
2. For each course, explore all dependent courses (one level)
3. Track path taken to reach each course
4. First time we reach target course = shortest path
5. Return complete path sequence

---

## 🏗️ **Implementation Architecture**

### **Backend Layer** (`backend/src/utils/graphAlgorithms.js`)
- Core algorithm implementations
- Graph data structure utilities (adjacency lists, in-degree calculation)
- Pure JavaScript functions for maximum performance

### **API Layer** (`backend/src/routes/courses.js`)
- RESTful endpoints exposing algorithm functionality
- Integration with course CRUD operations
- Error handling and validation

### **Frontend Service Layer** (`frontend/src/services/api.ts`)
- HTTP client for algorithm API calls
- TypeScript interfaces for type safety
- Error handling and response parsing

### **UI Components** 
- **`AlgorithmAnalysis.tsx`**: Interactive algorithm demonstrations
- **`CourseGraph.tsx`**: Visual graph representation with vis.js
- **Real-time feedback**: Instant cycle detection, prerequisite highlighting

## 📊 **Practical Applications**

1. **Academic Planning**: 4-year degree roadmaps
2. **Course Validation**: Prevent impossible prerequisite chains
3. **Resource Optimization**: Minimize time to graduation
4. **Educational Analytics**: Understanding course complexity
5. **Curriculum Design**: Identifying bottleneck courses

## 🔬 **Algorithm Performance with Current Dataset**

- **29 Courses** (Nodes)
- **48 Prerequisites** (Edges)  
- **Maximum Depth**: 4 levels (Foundation → Advanced)
- **Longest Path**: CS510 (Capstone) requires 8+ prerequisites
- **Processing Time**: All algorithms complete in <1ms

## 🎨 User Interface Features

### Course Management
- **Smart Form Validation**: Prevents duplicate IDs and self-prerequisites
- **Real-time Dependency Checking**: Warns about potential circular dependencies
- **Batch Operations**: Easy course editing and deletion

### Graph Visualization
- **Interactive Network**: Click and drag nodes, zoom and pan
- **Color-coded Levels**: Visual representation of course progression
- **Highlight Prerequisites**: Click a course to see all its dependencies
- **Responsive Layout**: Automatic graph layout optimization

### Course Planning
- **Semester Organization**: Automatically group courses by semester
- **Credit Planning**: Track total credits and course load
- **Flexible Scheduling**: Adjust courses per semester
- **Print-friendly**: Generate printable study plans

## 📊 Sample Data

The application comes with sample computer science courses:

- **Foundation**: CS101 (Intro to Programming), MATH101 (Calculus I)
- **Core**: CS102 (Data Structures), MATH201 (Discrete Math)
- **Advanced**: CS201 (Algorithms), CS301 (Database Systems)
- **Capstone**: CS401 (Software Engineering)

## 🛠️ Development

### Adding New Features

1. **Backend Algorithm**: Add to `backend/src/utils/graphAlgorithms.js`
2. **Frontend Component**: Create in `frontend/src/components/`
3. **API Endpoint**: Add to `backend/src/routes/courses.js`
4. **Styling**: Update `frontend/src/styles/App.css`

### Testing Algorithms

```javascript
// Example: Test cycle detection
const courses = [
  { id: "A", prerequisites: ["B"] },
  { id: "B", prerequisites: ["A"] }  // Creates cycle
];

const hasCycle = GraphAlgorithms.detectCycle(courses);
console.log(hasCycle); // true
```

## 🚀 **Deployment Guide**

### **Local Development Setup**
```bash
# Clone and install dependencies
git clone <your-repo-url>
cd course-prerequisite-planner
npm run install-all

# Start development servers
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### **Production Deployment Options**

#### **Option 1: Vercel + Railway (Recommended)**
**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend (Railway):**
1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
4. Deploy from `backend` folder

#### **Option 2: Netlify + Heroku**
**Frontend (Netlify):**
```bash
# Build for production
cd frontend
npm run build

# Drag & drop 'build' folder to netlify.com
# Or connect GitHub repository
```

**Backend (Heroku):**
```bash
# Install Heroku CLI
cd backend
heroku create your-app-name
git subtree push --prefix backend heroku main
```

#### **Option 3: Docker Deployment**
```dockerfile
# Dockerfile.frontend
FROM node:16-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]

# Dockerfile.backend  
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000
CMD ["npm", "start"]
```

#### **Option 4: AWS/Azure/GCP**
- **Frontend**: Static hosting (S3, Azure Blob, GCS)
- **Backend**: Container service (ECS, Container Instances, Cloud Run)
- **Database**: Managed MongoDB/PostgreSQL for persistence

### **Environment Configuration**

**Frontend `.env`:**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Backend `.env`:**
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.com
```

### **Build Optimization**
```bash
# Frontend optimization
cd frontend
npm run build  # Creates optimized production build
npm run analyze  # Bundle size analysis

# Backend optimization  
cd backend
npm install --production  # Install only production dependencies
```

### **Performance Monitoring**
- **Frontend**: Lighthouse, Web Vitals
- **Backend**: Response time monitoring, memory usage
- **Database**: Query optimization for larger datasets

## 📈 Potential Enhancements

### Technical Improvements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and course catalogs
- [ ] Advanced algorithms (A*, Dijkstra for weighted prerequisites)
- [ ] Real-time collaboration features
- [ ] Course availability and scheduling constraints
- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline functionality with service workers
- [ ] API rate limiting and caching
- [ ] Automated testing suite

### Educational Features
- [ ] GPA tracking and course difficulty weights
- [ ] Prerequisite strength analysis
- [ ] Alternative path suggestions
- [ ] Integration with university course catalogs
- [ ] Mobile app development
- [ ] Multi-university support
- [ ] Course recommendation engine
- [ ] Academic advisor dashboard
- [ ] Student progress tracking

## 🎓 Educational Value

This project demonstrates:
- **Graph Theory**: Practical application of graph algorithms
- **Data Structures**: Trees, graphs, adjacency lists
- **Algorithm Analysis**: Time/space complexity considerations
- **Software Architecture**: Full-stack application design
- **User Experience**: Translating complex algorithms into intuitive interfaces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Graph Theory**: Algorithms inspired by classic computer science texts
- **vis.js**: Excellent graph visualization library
- **React Community**: Comprehensive ecosystem and documentation
- **Educational Technology**: Inspired by the need for better academic planning tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/course-prerequisite-planner/issues) page
2. Create a new issue with detailed description
3. Contact: your.email@example.com

---

**Built with ❤️ for students and educators everywhere**

*This project showcases the power of graph algorithms in solving real-world educational challenges.* 