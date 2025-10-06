import express from "express"
import transactionCtrl from "../controllers/TransactionCtrl.js";


const router = express.Router();

// Rutas de transacciones
router.post('/', transactionCtrl.createTransaction);
router.get('/', transactionCtrl.getTransactions);
router.get('/summary', transactionCtrl.getSummary);
router.get('/by-category', transactionCtrl.getByCategory);
router.get('/:id', transactionCtrl.getTransactionById);
router.put('/:id', transactionCtrl.updateTransaction);
router.delete('/:id', transactionCtrl.deleteTransaction);

export default router;