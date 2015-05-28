var mongoose = require('mongoose');

module.exports = mongoose.model('Usuario', {
    nome: String,
    login: String,
    senha: String,
    data_cad: {
        type: Date, default: Date.now
    }
});
