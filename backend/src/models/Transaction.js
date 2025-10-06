// models/Transaction.js
import { Schema, model, } from "mongoose";

const transactionSchema = new Schema({
  tipo: {
    type: String,
    enum: ['ingreso', 'egreso'],
    required: [true, 'El tipo es obligatorio']
  },
  monto: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto debe ser positivo']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es obligatoria']
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  notas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: false
});

// Índices para mejorar búsquedas
transactionSchema.index({ fecha: -1 });
transactionSchema.index({ tipo: 1 });
transactionSchema.index({ categoria: 1 });

export default model('Transaction', transactionSchema);