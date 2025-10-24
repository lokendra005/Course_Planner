import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { Course } from './types';
import { ApiService } from './services/api';
import CourseGraph from './components/CourseGraph';
import AlgorithmAnalysis from './components/AlgorithmAnalysis';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'graph' | 'analysis'>('courses');

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    credits: 3,
    description: '',
    prerequisites: [] as string[]
  });

  useEffect(() => {
    checkServerHealth();
    fetchCourses();
  }, []);

  const checkServerHealth = async () => {
    try {
      const isHealthy = await ApiService.healthCheck();
      setServerStatus(isHealthy);
    } catch (error) {
      setServerStatus(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await ApiService.getCourses();
      setCourses(fetchedCourses);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to add courses');
      return;
    }
    
    if (!formData.id.trim() || !formData.name.trim()) {
      setError('Course ID and Name are required');
      return;
    }

    if (courses.some(c => c.id === formData.id)) {
      setError('Course ID already exists');
      return;
    }

    try {
      await ApiService.addCourse(formData);
      await fetchCourses();
      setFormData({
        id: '',
        name: '',
        credits: 3,
        description: '',
        prerequisites: []
      });
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!user) {
      setError('Please sign in to delete courses');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await ApiService.deleteCourse(id);
        await fetchCourses();
        setError(null);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const addPrerequisite = (prereqId: string) => {
    if (prereqId && !formData.prerequisites.includes(prereqId) && prereqId !== formData.id) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prereqId]
      }));
    }
  };

  const removePrerequisite = (prereqId: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereqId)
    }));
  };

  const clearError = () => setError(null);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📚 Course Prerequisite Planner</h1>
            <p>Plan your academic journey with graph algorithms</p>
          </div>
          <div className="header-right">
            <div className="server-status">
              <span className={`status-indicator ${serverStatus ? 'online' : 'offline'}`}>
                {serverStatus ? '🟢 Server Online' : '🔴 Server Offline'}
              </span>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <main className="app-main">
        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Course Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            📊 Graph Visualization
          </button>
          <button 
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            🧮 Algorithm Analysis
          </button>
        </div>

        {activeTab === 'courses' && (
          <div className="app-grid">
            {/* Course Form Section */}
            <section className="course-form-section">
            <h2>Add New Course</h2>
            {!user && (
              <div className="auth-notice">
                <p>Please sign in to add, edit, or delete courses.</p>
              </div>
            )}
            <form onSubmit={handleAddCourse} className="course-form">
              <div className="form-group">
                <label htmlFor="courseId">Course ID *</label>
                <input
                  id="courseId"
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                  placeholder="e.g., CS101"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseName">Course Name *</label>
                <input
                  id="courseName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Introduction to Programming"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="credits">Credits</label>
                <input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the course"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Prerequisites</label>
                <div className="prerequisites-section">
                  <div className="add-prerequisite">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addPrerequisite(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select a prerequisite...</option>
                      {courses
                        .filter(c => c.id !== formData.id && !formData.prerequisites.includes(c.id))
                        .map(course => (
                          <option key={course.id} value={course.id}>
                            {course.id} - {course.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="prerequisites-list">
                    {formData.prerequisites.length === 0 ? (
                      <p className="no-prerequisites">No prerequisites</p>
                    ) : (
                      formData.prerequisites.map(prereqId => {
                        const prereqCourse = courses.find(c => c.id === prereqId);
                        return (
                          <div key={prereqId} className="prerequisite-item">
                            <span>
                              {prereqCourse ? `${prereqCourse.id} - ${prereqCourse.name}` : prereqId}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePrerequisite(prereqId)}
                              className="remove-btn"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={!user}>
                  Add Course
                </button>
              </div>
            </form>
          </section>

          {/* Course List Section */}
          <section className="course-list-section">
            <h2>Course Catalog</h2>
            {loading ? (
              <div className="loading">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <h3>No courses yet</h3>
                <p>Add your first course to get started!</p>
              </div>
            ) : (
              <div className="course-list">
                <div className="course-stats">
                  <div className="stat">
                    <strong>{courses.length}</strong>
                    <span>Total Courses</span>
                  </div>
                  <div className="stat">
                    <strong>{courses.reduce((sum, c) => sum + c.credits, 0)}</strong>
                    <span>Total Credits</span>
                  </div>
                </div>

                <div className="courses-grid">
                  {courses.map(course => (
                    <div key={course.id} className="course-card">
                      <div className="course-header">
                        <div className="course-title">
                          <h5>{course.id}</h5>
                          <p>{course.name}</p>
                        </div>
                        <div className="course-credits">
                          {course.credits} credits
                        </div>
                      </div>

                      {course.description && (
                        <p className="course-description">{course.description}</p>
                      )}

                      <div className="course-prerequisites">
                        <strong>Prerequisites:</strong>
                        {course.prerequisites.length === 0 ? (
                          <span className="no-prereqs"> None</span>
                        ) : (
                          <div className="prereq-list">
                            {course.prerequisites.map(prereqId => (
                              <span key={prereqId} className="prereq-tag">
                                {prereqId}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="course-actions">
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="delete-btn"
                          disabled={!user}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
        )}

        {activeTab === 'graph' && (
          <div className="tab-content">
            <CourseGraph 
              courses={courses}
              selectedCourse={selectedCourse}
              onCourseSelect={setSelectedCourse}
            />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="tab-content">
            <AlgorithmAnalysis courses={courses} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="algorithm-showcase">
          <h3>🧮 Graph Algorithms Used:</h3>
          <div className="algorithms-grid">
            <div className="algorithm-card">
              <h4>Topological Sort</h4>
              <p>Orders courses respecting prerequisites</p>
            </div>
            <div className="algorithm-card">
              <h4>Cycle Detection</h4>
              <p>Prevents circular dependencies</p>
            </div>
            <div className="algorithm-card">
              <h4>DFS Traversal</h4>
              <p>Finds all prerequisites for a course</p>
            </div>
            <div className="algorithm-card">
              <h4>BFS Pathfinding</h4>
              <p>Finds shortest prerequisite paths</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 