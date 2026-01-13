const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  // FAQs
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,

  // Extension Officers
  getAllExtensionOfficers,
  getExtensionOfficerById,
  createExtensionOfficer,
  updateExtensionOfficer,
  deleteExtensionOfficer,

  // Government Programs
  getAllGovPrograms,
  getGovProgramById,
  createGovProgram,
  updateGovProgram,
  deleteGovProgram
} = require('../../controllers/admin/adminSupportController');

/**
 * ============================
 * ADMIN SUPPORT & EXTENSION
 * ============================
 * Base:
 * /api/admin/support
 */

/* =========================
   FAQ MANAGEMENT
========================= */

// 1️⃣ Get all FAQs
router.get(
  '/admin/support/faqs',
  authenticate,
  authorizeAdmin,
  getAllFAQs
);

// 2️⃣ Get single FAQ
router.get(
  '/admin/support/faqs/:faq-id',
  authenticate,
  authorizeAdmin,
  getFAQById
);

// 3️⃣ Create FAQ
router.post(
  '/admin/support/faqs',
  authenticate,
  authorizeAdmin,
  createFAQ
);

// 4️⃣ Update FAQ
router.put(
  '/admin/support/faqs/:faq-id',
  authenticate,
  authorizeAdmin,
  updateFAQ
);

// 5️⃣ Delete FAQ
router.delete(
  '/admin/support/faqs/:faq-id',
  authenticate,
  authorizeAdmin,
  deleteFAQ
);

/* =========================
   EXTENSION OFFICERS
========================= */

// 6️⃣ Get all officers
router.get(
  '/admin/support/extension-officers',
  authenticate,
  authorizeAdmin,
  getAllExtensionOfficers
);

// 7️⃣ Get single officer
router.get(
  '/admin/support/extension-officers/:officer-id',
  authenticate,
  authorizeAdmin,
  getExtensionOfficerById
);

// 8️⃣ Create officer
router.post(
  '/admin/support/extension-officers',
  authenticate,
  authorizeAdmin,
  createExtensionOfficer
);

// 9️⃣ Update officer
router.put(
  '/admin/support/extension-officers/:officer-id',
  authenticate,
  authorizeAdmin,
  updateExtensionOfficer
);

// 🔟 Delete officer
router.delete(
  '/admin/support/extension-officers/:officer-id',
  authenticate,
  authorizeAdmin,
  deleteExtensionOfficer
);

/* =========================
   GOVERNMENT PROGRAMS
========================= */

// 1️⃣1️⃣ Get all programs
router.get(
  '/admin/support/gov-programs',
  authenticate,
  authorizeAdmin,
  getAllGovPrograms
);

// 1️⃣2️⃣ Get program by ID
router.get(
  '/admin/support/gov-programs/:program-id',
  authenticate,
  authorizeAdmin,
  getGovProgramById
);

// 1️⃣3️⃣ Create program
router.post(
  '/admin/support/gov-programs',
  authenticate,
  authorizeAdmin,
  createGovProgram
);

// 1️⃣4️⃣ Update program
router.put(
  '/admin/support/gov-programs/:program-id',
  authenticate,
  authorizeAdmin,
  updateGovProgram
);

// 1️⃣5️⃣ Delete program
router.delete(
  '/admin/support/gov-programs/:program-id',
  authenticate,
  authorizeAdmin,
  deleteGovProgram
);

module.exports = router;
