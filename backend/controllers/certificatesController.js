const { db } = require('../firebase/firebaseAdmin');

const defaultCertificates = [
  {
    id: 'cert-1',
    title: 'Java Web App Development Internship',
    subtitle: 'Internship Completion Certificate',
    buttonText: 'View Certificate',
    link: '#'
  },
  {
    id: 'cert-2',
    title: 'Microsoft Azure AI Fundamentals',
    subtitle: 'Microsoft Certification',
    buttonText: 'View Certificate',
    link: '#'
  },
  {
    id: 'cert-3',
    title: 'AWS Cloud Fundamentals (Beginner)',
    subtitle: 'Cloud Certification',
    buttonText: 'View Certificate',
    link: '#'
  },
  {
    id: 'cert-4',
    title: 'IEEE MAS TECHCLAVE 2026',
    subtitle: 'Participation Certificate',
    buttonText: 'View Certificate',
    link: '#'
  }
];

/**
 * @desc    Get All Certificates
 * @route   GET /api/certificates
 * @access  Public
 */
const getCertificates = async (req, res, next) => {
  try {
    if (db) {
      const snapshot = await db.collection('certificates').get();
      if (!snapshot.empty) {
        const certificates = [];
        snapshot.forEach((doc) => certificates.push({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ success: true, count: certificates.length, data: certificates });
      }
    }
    return res.status(200).json({ success: true, count: defaultCertificates.length, data: defaultCertificates });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
};
