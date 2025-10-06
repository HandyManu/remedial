// controllers/category.controller.js
import Category from '../models/Category.js'

const categoryCtrl = {};

// Crear nueva categoría
categoryCtrl.createCategory = async (req, res) => {
  try {
    const { nombre, tipo, icono, color } = req.body;
    
    const newCategory = new Category({
      nombre,
      tipo,
      icono,
      color
    });

    await newCategory.save();
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// Obtener todas las categorías
categoryCtrl.getCategories = async (req, res) => {
  try {
    const { tipo, activa } = req.query;
    
    let filtro = {};
    if (tipo) filtro.tipo = { $in: [tipo, 'ambos'] };
    if (activa !== undefined) filtro.activa = activa === 'true';

    const categories = await Category.find(filtro).sort({ nombre: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// Obtener categoría por ID
categoryCtrl.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

// Actualizar categoría
categoryCtrl.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

// Eliminar categoría
categoryCtrl.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};

// Crear categorías por defecto
categoryCtrl.seedCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { nombre: 'Salario', tipo: 'ingreso', icono: '💰', color: '#2ecc71' },
      { nombre: 'Bonos', tipo: 'ingreso', icono: '🎁', color: '#27ae60' },
      { nombre: 'Inversiones', tipo: 'ingreso', icono: '📈', color: '#16a085' },
      { nombre: 'Alimentación', tipo: 'egreso', icono: '🍔', color: '#e74c3c' },
      { nombre: 'Transporte', tipo: 'egreso', icono: '🚗', color: '#e67e22' },
      { nombre: 'Educación', tipo: 'egreso', icono: '📚', color: '#3498db' },
      { nombre: 'Entretenimiento', tipo: 'egreso', icono: '🎮', color: '#9b59b6' },
      { nombre: 'Servicios', tipo: 'egreso', icono: '💡', color: '#f39c12' },
      { nombre: 'Salud', tipo: 'egreso', icono: '⚕️', color: '#1abc9c' },
      { nombre: 'Otros', tipo: 'ambos', icono: '📁', color: '#95a5a6' }
    ];

    await Category.insertMany(defaultCategories);

    res.status(201).json({
      success: true,
      message: 'Categorías por defecto creadas exitosamente',
      data: defaultCategories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear categorías por defecto',
      error: error.message
    });
  }
};

export default categoryCtrl;