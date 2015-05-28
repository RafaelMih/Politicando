var Usuario = require('./../models/usuario');

module.exports = function (app) {
    
    app.get('/api/users', function (req, res) {
    
        Usuario.find(function (err, nerds) {                       
            if (err)
                res.send(err);
            
            res.json(nerds);
        });
    });
    
    app.get('*', function (req, res) {
        res.sendfile('./public/views/home/index');
    });
};

module.exports = function (app) {
    var usuario = app.controllers.usuario;
    
    app.get('/usuario', usuario.index);
    app.get('/usuario/cadastro', usuario.cadastro)
    app.post('/usuario/cadastro', usuario.inserir)
    app.get('/usuario/editar/:id', usuario.editar)
    app.delete('/usuario/deletar/:id', usuario.deletar)
    app.put('/usuario/editar/:id', usuario.atualizar)
    app.get('/usuario/visualizar/:id', usuario.visualizar)
}