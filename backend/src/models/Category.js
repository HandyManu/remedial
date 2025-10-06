// models/Category.js
import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['ingreso', 'egreso', 'ambos'],
    default: 'ambos'
  },
  icono: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#3498db'
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: false
});

export default model('Category', categorySchema);