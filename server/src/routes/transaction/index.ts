import express from 'express';
import { transactionController } from '../../container/transaction.container';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, authorizeRoles } from '../../auth/authUtils';

const router = express.Router();

// User: view own transaction history
router.get(
  '/my-transactions',
  authentication,
  authorizeRoles('USER'),
  asyncHandler(transactionController.getMyTransactions),
);

// Admin/Manager: view all transactions
router.get(
  '/transactions',
  authentication,
  authorizeRoles('ADMIN', 'MANAGER'),
  asyncHandler(transactionController.getAllTransactions),
);

// Admin/Manager: get single transaction
router.get(
  '/transactions/:id',
  authentication,
  authorizeRoles('ADMIN', 'MANAGER'),
  asyncHandler(transactionController.getTransactionById),
);

// Admin/Manager: revenue report
router.get(
  '/reports/revenue',
  authentication,
  authorizeRoles('ADMIN', 'MANAGER'),
  asyncHandler(transactionController.getRevenueReport),
);

// Admin/Manager: booking report
router.get(
  '/reports/bookings',
  authentication,
  authorizeRoles('ADMIN', 'MANAGER'),
  asyncHandler(transactionController.getBookingReport),
);

export default router;
