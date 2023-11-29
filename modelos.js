const mongoose = require('mongoose')

// para no repetir el modelo que ya esta en interfaces\entry.js
mongoose.set('strictQuery', true);

// esto corre del lado del servidor
const clinicasSchema = new mongoose.Schema({
  nombre : { type: String, required: true },
  fecha : { type: Date, default : Date.now},
  motivo: {type : String, requiered : true},
  doctor : { type: String, required: true },
  notas : { type: String, required: true },
  foto : { type: String},

});

const clinicasModel =/* mongoose.models.Clinica || */mongoose.model('clinicas', clinicasSchema);

module.exports = clinicasModel;