const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerAddressesAdmin,
  getBuyerAddressByIdAdmin,
  createBuyerAddressAdmin,
  updateBuyerAddressAdmin,
  deleteBuyerAddressAdmin,
  verifyBuyerAddressAdmin,
  unverifyBuyerAddressAdmin
} = require('../../controllers/admin/buyer/adminBuyerAddressController');

/**
 * ==================================
 * ADMIN → BUYER ADDRESSES
 * Base: /api/admin/buyers
 * ==================================
 */

// 1️⃣ Get all addresses for a buyer
router.get(
  '/admin/buyers/:buyer-id/addresses',
  authenticate,
  authorizeAdmin,
  getBuyerAddressesAdmin
);

// 2️⃣ Get single address
router.get(
  '/admin/buyers/addresses/:address-id',
  authenticate,
  authorizeAdmin,
  getBuyerAddressByIdAdmin
);

// 3️⃣ Create address
router.post(
  '/admin/buyers/addresses',
  authenticate,
  authorizeAdmin,
  createBuyerAddressAdmin
);

// 4️⃣ Update address
router.put(
  '/admin/buyers/addresses/:address-id',
  authenticate,
  authorizeAdmin,
  updateBuyerAddressAdmin
);

// 5️⃣ Delete address
router.delete(
  '/admin/buyers/addresses/:address-id',
  authenticate,
  authorizeAdmin,
  deleteBuyerAddressAdmin
);

// 6️⃣ Verify address
router.put(
  '/admin/buyers/addresses/:address-id/verify',
  authenticate,
  authorizeAdmin,
  verifyBuyerAddressAdmin
);

// 7️⃣ Unverify address
router.put(
  '/admin/buyers/addresses/:address-id/unverify',
  authenticate,
  authorizeAdmin,
  unverifyBuyerAddressAdmin
);

module.exports = router;
