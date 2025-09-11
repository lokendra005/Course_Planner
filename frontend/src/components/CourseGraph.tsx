import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Network, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-data';
import { Course } from '../types';

interface CourseGraphProps {
  courses: Course[];
  selectedCourse?: string | null;
  onCourseSelect?: (courseId: string) => void;
}

const CourseGraph: React.FC<CourseGraphProps> = ({ courses, selectedCourse, onCourseSelect }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [edgesDataSet, setEdgesDataSet] = useState<DataSet<Edge, 'id'> | null>(null);

  const getCourseColor = useCallback((course: Course): any => {
    const level = getCourseLevel(course.id);
    const colors: Record<string, any> = {
      '100': { background: '#e3f2fd', border: '#1976d2' },
      '200': { background: '#f3e5f5', border: '#7b1fa2' },
      '300': { background: '#e8f5e8', border: '#388e3c' },
      '400': { background: '#fff3e0', border: '#f57c00' },
      '500': { background: '#ffebee', border: '#d32f2f' },
      'other': { background: '#f5f5f5', border: '#616161' }
    };
    return colors[level.toString()] || colors.other;
  }, []);

  const getCourseLevel = (courseId: string): number => {
    const match = courseId.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getAllPrerequisites = useCallback((courseId: string, allCourses: Course[]): string[] => {
    const visited = new Set<string>();
    const prerequisites: string[] = [];
    
    const dfs = (id: string) => {
      const course = allCourses.find(c => c.id === id);
      if (!course || visited.has(id)) return;
      
      visited.add(id);
      
      for (const prereq of course.prerequisites) {
        if (!prerequisites.includes(prereq)) {
          prerequisites.push(prereq);
        }
        dfs(prereq);
      }
    };
    
    dfs(courseId);
    return prerequisites;
  }, []);

  const highlightPrerequisitePath = useCallback((courseId: string) => {
    const allPrereqs = getAllPrerequisites(courseId, courses);
    setHighlightedPath([courseId, ...allPrereqs]);
  }, [getAllPrerequisites, courses]);

  useEffect(() => {
    if (!networkRef.current || courses.length === 0) return;

    // Create nodes and edges from courses
    const nodeData: Node[] = courses.map((course) => ({
      id: course.id,
      label: `${course.id}\n${course.name}`,
      title: `${course.name}\nCredits: ${course.credits}\n${course.description}`,
      color: getCourseColor(course),
      font: { size: 12, color: '#333' },
      shape: 'box',
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      widthConstraint: { maximum: 150 }
    }));

    const nodes = new DataSet<Node, 'id'>(nodeData);

    const edgeData: Edge[] = courses.flatMap((course) =>
      course.prerequisites.map((prereq) => ({
        id: `${prereq}-${course.id}`,
        from: prereq,
        to: course.id,
        arrows: 'to',
        color: { color: '#848484', highlight: '#ff6b6b' },
        width: 2,
        smooth: { 
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.4
        }
      }))
    );

    const edges = new DataSet<Edge, 'id'>(edgeData);
    setEdgesDataSet(edges);

    const data = { nodes, edges };
    
    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 100,
          nodeSpacing: 150,
          treeSpacing: 200
        }
      },
      physics: {
        enabled: false
      },
      interaction: {
        dragNodes: true,
        zoomView: true,
        selectConnectedEdges: false
      },
      nodes: {
        borderWidth: 2,
        borderWidthSelected: 4,
        chosen: true
      },
      edges: {
        width: 2,
        selectionWidth: 4
      }
    };

    networkInstance.current = new Network(networkRef.current, data, options);

    // Handle node selection
    networkInstance.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        if (onCourseSelect) {
          onCourseSelect(nodeId);
        }
        highlightPrerequisitePath(nodeId);
      }
    });

    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }
    };
  }, [courses, getCourseColor, highlightPrerequisitePath, onCourseSelect]);

  const getHighlightColor = useCallback((courseId: string, selected: string, prereqs: string[]): any => {
    if (courseId === selected) {
      return { background: '#ff4444', border: '#cc0000' }; // Red for selected
    } else if (prereqs.includes(courseId)) {
      return { background: '#44ff44', border: '#00cc00' }; // Green for prerequisites
    } else {
      const course = courses.find(c => c.id === courseId);
      return course ? getCourseColor(course) : { background: '#f5f5f5', border: '#616161' };
    }
  }, [courses, getCourseColor]);

  // Highlight selected course and its prerequisites
  useEffect(() => {
    if (!networkInstance.current || !selectedCourse || !edgesDataSet) return;

    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return;

    // Get all prerequisites recursively
    const allPrereqs = getAllPrerequisites(selectedCourse, courses);
    setHighlightedPath([selectedCourse, ...allPrereqs]);

    // Update node colors
    const nodeUpdates: Node[] = courses.map((c) => ({
      id: c.id,
      label: `${c.id}\n${c.name}`,
      title: `${c.name}\nCredits: ${c.credits}\n${c.description}`,
      color: getHighlightColor(c.id, selectedCourse, allPrereqs),
      font: { size: 12, color: '#333' },
      shape: 'box',
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      widthConstraint: { maximum: 150 }
    }));

    networkInstance.current.setData({
      nodes: new DataSet<Node, 'id'>(nodeUpdates),
      edges: edgesDataSet
    });
  }, [selectedCourse, courses, getAllPrerequisites, getHighlightColor, edgesDataSet]);

  return (
    <div className="course-graph-container">
      <div className="graph-header">
        <h3>📊 Course Dependency Graph</h3>
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#e3f2fd', border: '2px solid #1976d2' }}></div>
            <span>100-level (Foundation)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f3e5f5', border: '2px solid #7b1fa2' }}></div>
            <span>200-level (Intermediate)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#e8f5e8', border: '2px solid #388e3c' }}></div>
            <span>300-level (Core)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#fff3e0', border: '2px solid #f57c00' }}></div>
            <span>400-level (Advanced)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ffebee', border: '2px solid #d32f2f' }}></div>
            <span>500-level (Graduate)</span>
          </div>
        </div>
        {selectedCourse && (
          <div className="selected-course-info">
            <strong>Selected:</strong> {selectedCourse}
            {highlightedPath.length > 1 && (
              <span className="prereq-count">
                ({highlightedPath.length - 1} prerequisites)
              </span>
            )}
          </div>
        )}
      </div>
      <div 
        ref={networkRef} 
        className="course-graph" 
        style={{ height: '500px', border: '1px solid #ddd', borderRadius: '8px' }}
      />
      <div className="graph-instructions">
        <p>📌 <strong>Click on any course</strong> to highlight its prerequisite chain</p>
        <p>🔍 <strong>Zoom and pan</strong> to explore the full dependency network</p>
      </div>
    </div>
  );
};

export default CourseGraph; 