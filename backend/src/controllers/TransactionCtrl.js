import  Transaction from '../models/Transaction.js'

const transactionCtrl = {};

// Crear nueva transacción
transactionCtrl.createTransaction = async (req, res) => {
  try {
    const { tipo, monto, descripcion, categoria, fecha, notas } = req.body;
    
    const newTransaction = new Transaction({
      tipo,
      monto,
      descripcion,
      categoria,
      fecha: fecha || Date.now(),
      notas
    });

    await newTransaction.save();
    await newTransaction.populate('categoria');
    
    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: newTransaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear transacción',
      error: error.message
    });
  }
};

// Obtener todas las transacciones
transactionCtrl.getTransactions = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin, categoria } = req.query;
    
    let filtro = {};
    
    if (tipo) filtro.tipo = tipo;
    if (categoria) filtro.categoria = categoria;
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    const transactions = await Transaction.find(filtro)
      .populate('categoria')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones',
      error: error.message
    });
  }
};

// Obtener transacción por ID
transactionCtrl.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('categoria');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacción',
      error: error.message
    });
  }
};

// Actualizar transacción
transactionCtrl.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoria');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente',
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar transacción',
      error: error.message
    });
  }
};

// Eliminar transacción
transactionCtrl.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar transacción',
      error: error.message
    });
  }
};

// Obtener resumen de transacciones
transactionCtrl.getSummary = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    let filtro = {};
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    const ingresos = await Transaction.aggregate([
      { $match: { ...filtro, tipo: 'ingreso' } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);

    const egresos = await Transaction.aggregate([
      { $match: { ...filtro, tipo: 'egreso' } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);

    const totalIngresos = ingresos[0]?.total || 0;
    const totalEgresos = egresos[0]?.total || 0;
    const balance = totalIngresos - totalEgresos;

    res.json({
      success: true,
      data: {
        totalIngresos,
        totalEgresos,
        balance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen',
      error: error.message
    });
  }
};

// Obtener gastos por categoría
transactionCtrl.getByCategory = async (req, res) => {
  try {
    const { tipo = 'egreso' } = req.query;

    const result = await Transaction.aggregate([
      { $match: { tipo } },
      {
        $group: {
          _id: '$categoria',
          total: { $sum: '$monto' },
          cantidad: { $count: {} }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      { $unwind: '$categoria' },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener gastos por categoría',
      error: error.message
    });
  }
};

export default transactionCtrl;