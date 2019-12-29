const mongoose = require('mongoose');
const { Schema } = mongoose;

const saleShema = new Schema({
  user: {type: String, required: true},
  product: { type: String, required: true},
  date: { type: Date, required: true},
});

//Usamos el metodo model para reutilizar el modelo anterior
module.exports = mongoose.model('sale', saleShema);