const { db } = require('../firebase/firebaseAdmin');

const defaultProfile = {
  name: 'Bhuvaneshwari S',
  title: 'Frontend Developer & BE CSE Student',
  degree: 'Bachelor of Engineering in Computer Science & Engineering',
  cgpa: '8.56',
  email: 'bhuvaneshwari.tamilselvan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bhuvaneshwari-tamilselvan',
  github: 'https://github.com/Bhuvi-31',
  skills: [
    'HTML5 & CSS3',
    'JavaScript (ES6+)',
    'Python',
    'Computer Vision',
    'Git & GitHub',
    'C Programming',
    'UI / UX Design',
    'Website Building',
    'Java'
  ]
};

/**
 * @desc    Get Portfolio Profile Info
 * @route   GET /api/profile
 * @access  Public
 */
const getProfile = async (req, res, next) => {
  try {
    if (db) {
      const doc = await db.collection('profile').doc('main').get();
      if (doc.exists) {
        return res.status(200).json({ success: true, data: doc.data() });
      }
    }
    return res.status(200).json({ success: true, data: defaultProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
