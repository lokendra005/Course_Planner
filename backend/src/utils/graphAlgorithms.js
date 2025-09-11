class GraphAlgorithms {
  
  /**
   * Detects if there's a cycle in the course prerequisite graph
   * Uses DFS with color coding: WHITE(0), GRAY(1), BLACK(2)
   */
  static detectCycle(courses) {
    const adjList = this.buildAdjacencyList(courses);
    const color = {};
    
    // Initialize all nodes as WHITE (unvisited)
    for (const course of courses) {
      color[course.id] = 0;
    }
    
    // Check each unvisited node
    for (const course of courses) {
      if (color[course.id] === 0) {
        if (this.hasCycleDFS(course.id, adjList, color)) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
   * DFS helper for cycle detection
   */
  static hasCycleDFS(nodeId, adjList, color) {
    color[nodeId] = 1; // Mark as GRAY (visiting)
    
    const neighbors = adjList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (color[neighbor] === 1) {
        return true; // Back edge found - cycle detected
      }
      if (color[neighbor] === 0 && this.hasCycleDFS(neighbor, adjList, color)) {
        return true;
      }
    }
    
    color[nodeId] = 2; // Mark as BLACK (visited)
    return false;
  }
  
  /**
   * Performs topological sort using Kahn's algorithm
   * Returns the recommended course order
   */
  static topologicalSort(courses) {
    const adjList = this.buildAdjacencyList(courses);
    const inDegree = this.calculateInDegree(courses);
    const queue = [];
    const result = [];
    
    // Find all nodes with in-degree 0
    for (const course of courses) {
      if (inDegree[course.id] === 0) {
        queue.push(course.id);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);
      
      const neighbors = adjList[current] || [];
      for (const neighbor of neighbors) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // If result length != courses length, there's a cycle
    if (result.length !== courses.length) {
      throw new Error('Cycle detected in prerequisites!');
    }
    
    return result;
  }
  
  /**
   * Finds all prerequisites for a specific course using DFS
   */
  static findAllPrerequisites(courseId, courses) {
    const adjList = this.buildReverseAdjacencyList(courses);
    const visited = new Set();
    const prerequisites = [];
    
    this.dfsPrerequisites(courseId, adjList, visited, prerequisites);
    
    return prerequisites.filter(id => id !== courseId);
  }
  
  /**
   * DFS helper for finding prerequisites
   */
  static dfsPrerequisites(nodeId, adjList, visited, prerequisites) {
    visited.add(nodeId);
    prerequisites.push(nodeId);
    
    const prereqs = adjList[nodeId] || [];
    for (const prereq of prereqs) {
      if (!visited.has(prereq)) {
        this.dfsPrerequisites(prereq, adjList, visited, prerequisites);
      }
    }
  }
  
  /**
   * Builds adjacency list from courses (course -> its dependents)
   */
  static buildAdjacencyList(courses) {
    const adjList = {};
    
    for (const course of courses) {
      if (!adjList[course.id]) {
        adjList[course.id] = [];
      }
      
      for (const prereq of (course.prerequisites || [])) {
        if (!adjList[prereq]) {
          adjList[prereq] = [];
        }
        adjList[prereq].push(course.id);
      }
    }
    
    return adjList;
  }
  
  /**
   * Builds reverse adjacency list (course -> its prerequisites)
   */
  static buildReverseAdjacencyList(courses) {
    const adjList = {};
    
    for (const course of courses) {
      adjList[course.id] = course.prerequisites || [];
    }
    
    return adjList;
  }
  
  /**
   * Calculates in-degree for each course
   */
  static calculateInDegree(courses) {
    const inDegree = {};
    
    // Initialize all in-degrees to 0
    for (const course of courses) {
      inDegree[course.id] = 0;
    }
    
    // Count incoming edges (prerequisites)
    for (const course of courses) {
      for (const prereq of (course.prerequisites || [])) {
        if (inDegree[course.id] !== undefined) {
          inDegree[course.id]++;
        }
      }
    }
    
    return inDegree;
  }
  
  /**
   * Finds the shortest path between two courses (minimum prerequisites)
   */
  static findShortestPath(startCourseId, endCourseId, courses) {
    const adjList = this.buildAdjacencyList(courses);
    const queue = [{ id: startCourseId, path: [startCourseId] }];
    const visited = new Set();
    
    while (queue.length > 0) {
      const { id, path } = queue.shift();
      
      if (id === endCourseId) {
        return path;
      }
      
      if (visited.has(id)) {
        continue;
      }
      
      visited.add(id);
      
      const neighbors = adjList[id] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }
    
    return null; // No path found
  }
}

module.exports = GraphAlgorithms; 