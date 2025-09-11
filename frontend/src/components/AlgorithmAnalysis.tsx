import React, { useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import { ApiService } from '../services/api';

interface AlgorithmAnalysisProps {
  courses: Course[];
}

const AlgorithmAnalysis: React.FC<AlgorithmAnalysisProps> = ({ courses }) => {
  const [courseOrder, setCourseOrder] = useState<Course[]>([]);
  const [selectedCourseAnalysis, setSelectedCourseAnalysis] = useState<string>('');
  const [prerequisites, setPrerequisites] = useState<Course[]>([]);
  const [algorithmStats, setAlgorithmStats] = useState({
    totalCourses: 0,
    totalPrerequisites: 0,
    longestPath: 0,
    cyclicDependencies: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const findLongestPrerequisitePath = useCallback((): number => {
    let maxDepth = 0;
    
    const calculateDepth = (courseId: string, visited: Set<string> = new Set()): number => {
      if (visited.has(courseId)) return 0; // Avoid infinite recursion
      
      const course = courses.find(c => c.id === courseId);
      if (!course || course.prerequisites.length === 0) return 1;
      
      visited.add(courseId);
      const depths = course.prerequisites.map(prereq => calculateDepth(prereq, new Set(visited)));
      visited.delete(courseId);
      
      return 1 + Math.max(...depths, 0);
    };
    
    courses.forEach(course => {
      const depth = calculateDepth(course.id);
      maxDepth = Math.max(maxDepth, depth);
    });
    
    return maxDepth;
  }, [courses]);

  const analyzeAlgorithms = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get topological sort order
      const orderResponse = await ApiService.getCourseOrder();
      setCourseOrder(orderResponse.order);

      // Calculate statistics
      const totalPrereqs = courses.reduce((sum, course) => sum + course.prerequisites.length, 0);
      const longestPath = findLongestPrerequisitePath();
      
      // Check for cycles
      const validationResult = await ApiService.validateCourses(courses);
      
      setAlgorithmStats({
        totalCourses: courses.length,
        totalPrerequisites: totalPrereqs,
        longestPath,
        cyclicDependencies: !validationResult.valid
      });
    } catch (error) {
      console.error('Error analyzing algorithms:', error);
    } finally {
      setIsLoading(false);
    }
  }, [courses, findLongestPrerequisitePath]);

  useEffect(() => {
    if (courses.length > 0) {
      analyzeAlgorithms();
    }
  }, [courses, analyzeAlgorithms]);

  const analyzeCourse = async (courseId: string) => {
    if (!courseId) return;
    
    setSelectedCourseAnalysis(courseId);
    setIsLoading(true);
    
    try {
      const response = await ApiService.getCoursePrerequisites(courseId);
      setPrerequisites(response.prerequisites);
    } catch (error) {
      console.error('Error analyzing course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupCoursesBySemester = (): Course[][] => {
    const semesters: Course[][] = [];
    const remaining = [...courseOrder];
    
    while (remaining.length > 0) {
      const semester: Course[] = [];
      const toRemove: Course[] = [];
      
      remaining.forEach(course => {
        const canTakeThisSemester = course.prerequisites.every(prereq => 
          semesters.flat().some(takenCourse => takenCourse.id === prereq)
        );
        
        if (canTakeThisSemester && semester.length < 5) { // Max 5 courses per semester
          semester.push(course);
          toRemove.push(course);
        }
      });
      
      if (semester.length === 0 && remaining.length > 0) {
        // If we can't make progress, add remaining courses (might indicate cycle)
        semester.push(remaining[0]);
        toRemove.push(remaining[0]);
      }
      
      semesters.push(semester);
      toRemove.forEach(course => {
        const index = remaining.indexOf(course);
        if (index > -1) remaining.splice(index, 1);
      });
    }
    
    return semesters;
  };

  const semesterPlan = groupCoursesBySemester();

  return (
    <div className="algorithm-analysis">
      <h2>🧮 Graph Algorithm Analysis</h2>
      
      {/* Algorithm Statistics */}
      <div className="algorithm-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{algorithmStats.totalCourses}</div>
            <div className="stat-label">Total Courses</div>
            <div className="stat-description">Nodes in graph</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{algorithmStats.totalPrerequisites}</div>
            <div className="stat-label">Prerequisites</div>
            <div className="stat-description">Edges in graph</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{algorithmStats.longestPath}</div>
            <div className="stat-label">Longest Path</div>
            <div className="stat-description">Maximum course depth</div>
          </div>
          <div className="stat-card">
            <div className={`stat-number ${algorithmStats.cyclicDependencies ? 'error' : 'success'}`}>
              {algorithmStats.cyclicDependencies ? '❌' : '✅'}
            </div>
            <div className="stat-label">Cycle Detection</div>
            <div className="stat-description">
              {algorithmStats.cyclicDependencies ? 'Cycles found' : 'No cycles'}
            </div>
          </div>
        </div>
      </div>

      {/* Topological Sort Results */}
      <div className="algorithm-section">
        <h3>📋 Topological Sort Results (Kahn's Algorithm)</h3>
        <p className="algorithm-description">
          Optimal course ordering that respects all prerequisites using Kahn's algorithm with in-degree calculation.
        </p>
        
        {semesterPlan.length > 0 && (
          <div className="semester-plan">
            {semesterPlan.map((semester, index) => (
              <div key={index} className="semester">
                <h4>Semester {index + 1}</h4>
                <div className="semester-courses">
                  {semester.map(course => (
                    <div key={course.id} className="semester-course">
                      <span className="course-id">{course.id}</span>
                      <span className="course-name">{course.name}</span>
                      <span className="course-credits">{course.credits} cr</span>
                    </div>
                  ))}
                </div>
                <div className="semester-total">
                  Total: {semester.reduce((sum, c) => sum + c.credits, 0)} credits
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prerequisite Analysis */}
      <div className="algorithm-section">
        <h3>🔍 Prerequisite Analysis (DFS Traversal)</h3>
        <p className="algorithm-description">
          Deep analysis of course dependencies using Depth-First Search to find all required prerequisites.
        </p>
        
        <div className="course-analyzer">
          <label htmlFor="courseSelect">Select a course to analyze:</label>
          <select 
            id="courseSelect"
            value={selectedCourseAnalysis} 
            onChange={(e) => analyzeCourse(e.target.value)}
            className="course-select"
          >
            <option value="">Choose a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.id} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCourseAnalysis && prerequisites.length > 0 && (
          <div className="prerequisite-analysis">
            <h4>Prerequisites for {selectedCourseAnalysis}:</h4>
            <div className="prerequisite-tree">
              {prerequisites.map((prereq, index) => (
                <div key={prereq.id} className="prerequisite-item">
                  <span className="prereq-index">{index + 1}.</span>
                  <span className="prereq-id">{prereq.id}</span>
                  <span className="prereq-name">{prereq.name}</span>
                  <span className="prereq-credits">({prereq.credits} credits)</span>
                </div>
              ))}
            </div>
            <div className="analysis-summary">
              <strong>Total prerequisites: {prerequisites.length}</strong>
              <br />
              <strong>Total prerequisite credits: {prerequisites.reduce((sum, p) => sum + p.credits, 0)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Algorithm Complexity */}
      <div className="algorithm-section">
        <h3>⚡ Algorithm Complexity Analysis</h3>
        <div className="complexity-grid">
          <div className="complexity-card">
            <h4>Cycle Detection</h4>
            <div className="complexity-info">
              <div><strong>Algorithm:</strong> DFS with Color Coding</div>
              <div><strong>Time:</strong> O(V + E)</div>
              <div><strong>Space:</strong> O(V)</div>
              <div><strong>Current:</strong> O({algorithmStats.totalCourses} + {algorithmStats.totalPrerequisites})</div>
            </div>
          </div>
          
          <div className="complexity-card">
            <h4>Topological Sort</h4>
            <div className="complexity-info">
              <div><strong>Algorithm:</strong> Kahn's Algorithm</div>
              <div><strong>Time:</strong> O(V + E)</div>
              <div><strong>Space:</strong> O(V)</div>
              <div><strong>Current:</strong> O({algorithmStats.totalCourses} + {algorithmStats.totalPrerequisites})</div>
            </div>
          </div>
          
          <div className="complexity-card">
            <h4>Prerequisite DFS</h4>
            <div className="complexity-info">
              <div><strong>Algorithm:</strong> Depth-First Search</div>
              <div><strong>Time:</strong> O(V + E)</div>
              <div><strong>Space:</strong> O(V)</div>
              <div><strong>Current:</strong> O({algorithmStats.totalCourses} + {algorithmStats.totalPrerequisites})</div>
            </div>
          </div>
          
          <div className="complexity-card">
            <h4>Shortest Path</h4>
            <div className="complexity-info">
              <div><strong>Algorithm:</strong> Breadth-First Search</div>
              <div><strong>Time:</strong> O(V + E)</div>
              <div><strong>Space:</strong> O(V)</div>
              <div><strong>Current:</strong> O({algorithmStats.totalCourses} + {algorithmStats.totalPrerequisites})</div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">🔄 Analyzing algorithms...</div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmAnalysis; 