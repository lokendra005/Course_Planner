const express = require('express');
const fs = require('fs');
const path = require('path');
const GraphAlgorithms = require('../utils/graphAlgorithms');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/courses.json');

// Helper function to read courses from JSON file
const readCourses = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write courses to JSON file
const writeCourses = (courses) => {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(courses, null, 2));
};

// GET /api/courses - Get all courses
router.get('/', (req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// POST /api/courses - Add a new course
router.post('/', (req, res) => {
  try {
    const { id, name, credits, description, prerequisites } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'Course ID and name are required' });
    }
    
    const courses = readCourses();
    
    // Check if course already exists
    if (courses.find(course => course.id === id)) {
      return res.status(400).json({ error: 'Course ID already exists' });
    }
    
    const newCourse = {
      id,
      name,
      credits: credits || 3,
      description: description || '',
      prerequisites: prerequisites || []
    };
    
    // Check for cycles before adding
    const testCourses = [...courses, newCourse];
    if (GraphAlgorithms.detectCycle(testCourses)) {
      return res.status(400).json({ 
        error: 'Adding this course would create a circular prerequisite dependency' 
      });
    }
    
    courses.push(newCourse);
    writeCourses(courses);
    
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// PUT /api/courses/:id - Update a course
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, credits, description, prerequisites } = req.body;
    
    const courses = readCourses();
    const courseIndex = courses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update course
    const updatedCourse = {
      ...courses[courseIndex],
      name: name || courses[courseIndex].name,
      credits: credits !== undefined ? credits : courses[courseIndex].credits,
      description: description !== undefined ? description : courses[courseIndex].description,
      prerequisites: prerequisites !== undefined ? prerequisites : courses[courseIndex].prerequisites
    };
    
    // Check for cycles with updated course
    const testCourses = [...courses];
    testCourses[courseIndex] = updatedCourse;
    
    if (GraphAlgorithms.detectCycle(testCourses)) {
      return res.status(400).json({ 
        error: 'Updating this course would create a circular prerequisite dependency' 
      });
    }
    
    courses[courseIndex] = updatedCourse;
    writeCourses(courses);
    
    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const courses = readCourses();
    
    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Remove course from all prerequisite lists
    courses.forEach(course => {
      course.prerequisites = (course.prerequisites || []).filter(prereq => prereq !== id);
    });
    
    // Remove the course itself
    courses.splice(courseIndex, 1);
    writeCourses(courses);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// GET /api/courses/order - Get recommended course order using topological sort
router.get('/order', (req, res) => {
  try {
    const courses = readCourses();
    
    if (courses.length === 0) {
      return res.json({ order: [], message: 'No courses available' });
    }
    
    const order = GraphAlgorithms.topologicalSort(courses);
    const orderedCourses = order.map(courseId => 
      courses.find(course => course.id === courseId)
    ).filter(Boolean);
    
    res.json({ 
      order: orderedCourses,
      message: 'Courses ordered by prerequisites using topological sort'
    });
  } catch (error) {
    if (error.message.includes('Cycle detected')) {
      res.status(400).json({ error: 'Cannot create course order: circular dependencies detected' });
    } else {
      res.status(500).json({ error: 'Failed to generate course order' });
    }
  }
});

// GET /api/courses/:id/prerequisites - Get all prerequisites for a course
router.get('/:id/prerequisites', (req, res) => {
  try {
    const { id } = req.params;
    const courses = readCourses();
    
    const course = courses.find(c => c.id === id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const allPrerequisites = GraphAlgorithms.findAllPrerequisites(id, courses);
    const prerequisiteCourses = allPrerequisites.map(prereqId => 
      courses.find(course => course.id === prereqId)
    ).filter(Boolean);
    
    res.json({ 
      course: course.name,
      prerequisites: prerequisiteCourses 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find prerequisites' });
  }
});

// POST /api/courses/validate - Validate course prerequisites for cycles
router.post('/validate', (req, res) => {
  try {
    const courses = req.body;
    
    if (!Array.isArray(courses)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    const hasCycle = GraphAlgorithms.detectCycle(courses);
    
    res.json({ 
      valid: !hasCycle,
      message: hasCycle ? 'Circular dependencies detected' : 'No circular dependencies found'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate courses' });
  }
});

module.exports = router; 