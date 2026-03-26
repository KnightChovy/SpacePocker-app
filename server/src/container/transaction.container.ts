import { TransactionRepository } from '../repository/transaction.repository';
import TransactionService from '../services/transaction.service';
import TransactionController from '../controllers/transaction.controller';

const transactionRepo = new TransactionRepository();
const transactionService = new TransactionService(transactionRepo);

export const transactionController = new TransactionController(transactionService);
