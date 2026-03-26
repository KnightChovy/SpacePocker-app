import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/transaction.service';
import { OK } from '../core/success.response';

class TransactionController {
  constructor(private transactionService: TransactionService) {}

  getMyTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Get my transactions successfully',
      metadata: await this.transactionService.getMyTransactions(
        String(req.user?.userId),
        {
          paymentMethod: req.query.paymentMethod as string | undefined,
          status: req.query.status as string | undefined,
          startDate: req.query.startDate as string | undefined,
          endDate: req.query.endDate as string | undefined,
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
        },
      ),
    }).send(res);
  };

  getAllTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Get all transactions successfully',
      metadata: await this.transactionService.getAllTransactions({
        userId: req.query.userId as string | undefined,
        paymentMethod: req.query.paymentMethod as string | undefined,
        status: req.query.status as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      }),
    }).send(res);
  };

  getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Get transaction successfully',
      metadata: await this.transactionService.getTransactionById(
        String(req.params.id),
      ),
    }).send(res);
  };

  getRevenueReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Revenue report generated successfully',
      metadata: await this.transactionService.getRevenueReport({
        startDate: String(req.query.startDate || ''),
        endDate: String(req.query.endDate || ''),
        groupBy: req.query.groupBy as string | undefined,
        managerId: req.query.managerId as string | undefined,
      }),
    }).send(res);
  };

  getBookingReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Booking report generated successfully',
      metadata: await this.transactionService.getBookingReport({
        startDate: String(req.query.startDate || ''),
        endDate: String(req.query.endDate || ''),
        managerId: req.query.managerId as string | undefined,
      }),
    }).send(res);
  };
}

export default TransactionController;
