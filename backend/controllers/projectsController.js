const { db } = require('../firebase/firebaseAdmin');

/**
 * Default Project Data Fallback
 */
const defaultProjects = [
  {
    id: 'proj-1',
    title: 'Medical Token – Government Hospital Live Queue & Enterprise Admin CRM System',
    category: 'Web & Mobile App',
    year: '2026',
    description: [
      'Developed a hybrid web and mobile application for hospital token and queue management.',
      'Implemented patient registration, live token tracking, QR code scanning, and enterprise hospital CRM.',
      'Built secure authentication and real-time queue synchronization using Firebase.',
      'Designed responsive web interfaces with dark mode and accessibility support.',
      'Integrated Google Maps, local storage, analytics, and cloud-based hospital management.'
    ],
    technologies: [
      'Flutter', 'Dart', 'HTML5', 'CSS3', 'JavaScript',
      'Firebase Authentication', 'Cloud Firestore', 'Firebase Storage',
      'Firebase Analytics', 'Provider', 'Google Maps Flutter', 'Mobile Scanner', 'Node.js'
    ],
    link: '#'
  },
  {
    id: 'proj-2',
    title: 'Gesture Control for Browser Games',
    category: 'AI & Computer Vision & Web',
    year: '2025',
    description: [
      'OpenCV & MediaPipe hand tracking framework running at 30+ FPS.',
      'WebSocket connection for sub-millisecond messages between Python backend and browser frontend.',
      'Configurable gesture mapping and zero local game modifications required.'
    ],
    technologies: ['Python', 'OpenCV', 'MediaPipe', 'WebSockets', 'JavaScript'],
    link: 'https://github.com/Bhuvi-31'
  },
  {
    id: 'proj-3',
    title: 'Personal Portfolio Website',
    category: 'Web Design',
    year: '2025',
    description: [
      'A premium portfolio displaying modern animations, custom properties, and smooth reveals.'
    ],
    technologies: ['HTML5', 'CSS Variables', 'Vanilla JS'],
    link: 'https://github.com/Bhuvi-31'
  },
  {
    id: 'proj-4',
    title: 'Interactive Interface Toolkit',
    category: 'UI Components',
    year: '2025',
    description: [
      'Custom UI components including modal dialogs, carousels, responsive tables, and forms.'
    ],
    technologies: ['CSS Grid', 'Accessibility', 'ES6 Events'],
    link: 'https://github.com/Bhuvi-31'
  },
  {
    id: 'proj-5',
    title: 'Minimalist Productivity Dashboard',
    category: 'Web Application',
    year: '2024',
    description: [
      'A performance-optimized productivity application demonstrating state management and local storage.'
    ],
    technologies: ['LocalStorage', 'JSON API', 'CSS Flexbox'],
    link: 'https://github.com/Bhuvi-31'
  }
];

/**
 * @desc    Get All Projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    if (db) {
      const snapshot = await db.collection('projects').get();
      if (!snapshot.empty) {
        const projects = [];
        snapshot.forEach((doc) => projects.push({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ success: true, count: projects.length, data: projects });
      }
    }
    return res.status(200).json({ success: true, count: defaultProjects.length, data: defaultProjects });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
};
