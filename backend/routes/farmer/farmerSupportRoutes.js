// routes/farmerSupportRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

// Import all controller functions correctly
const farmerSupportController = require('../../controllers/farmer/farmerSupportController');

const {
  getFAQs,
  getFAQById,
  getExtensionServices,
  getExtensionOfficerById,
  contactExtensionOfficer,
  contactMultipleExtensionOfficers,
  getGovPrograms,
  addForumPost,
  replyForumPost,
  getForumPosts,
  getForumPostById,
  deleteForumPost,
  deleteForumReply
} = farmerSupportController; // <- this is important

// =======================
// SUPPORT ROUTES
// =======================

// FAQs (Public)
router.get('/faqs', getFAQs);                      
router.get('/faqs/:faqId', getFAQById);           

// Extension Officers (Public)
router.get('/extension-officers', getExtensionServices);           
router.get('/extension-officers/:officerId', getExtensionOfficerById); 

// Contact Extension Officers (Auth required)
router.post('/contact-officer', authenticate, contactExtensionOfficer);         
router.post('/contact-officers', authenticate, contactMultipleExtensionOfficers); 

// Government Programs (Public)
router.get('/gov-programs', getGovPrograms);       

// =======================
// FORUM ROUTES (Auth required)
// =======================

// Forum posts
router.post('/forum', authenticate, addForumPost);                 
router.post('/forum/:postId/reply', authenticate, replyForumPost); 
router.get('/forum', getForumPosts);                               
router.get('/forum/:postId', getForumPostById);                     

// Delete operations (Auth required)
router.delete('/forum/:postId', authenticate, deleteForumPost);     
router.delete('/forum/reply/:replyId', authenticate, deleteForumReply); 

module.exports = router;
