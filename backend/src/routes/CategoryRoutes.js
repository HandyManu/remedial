// routes/category.routes.js
import express from "express";
import categoryCtrl from "../controllers/CategoryCtrl.js";
const router = express.Router();

// Rutas de categorías
router.post('/', categoryCtrl.createCategory);
router.post('/seed', categoryCtrl.seedCategories);
router.get('/', categoryCtrl.getCategories);
router.get('/:id', categoryCtrl.getCategoryById);
router.put('/:id', categoryCtrl.updateCategory);
router.delete('/:id', categoryCtrl.deleteCategory);

export default router;