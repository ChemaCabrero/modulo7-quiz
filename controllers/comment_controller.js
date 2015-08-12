var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
            where: {
                id: Number(commentId)
            }
        }).then(function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else{next(new Error('No existe commentId=' + commentId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

exports.create = function(req, res) {  // POST /quizes/:quizId/comments
  var comment = models.Comment.build({ // construccion objeto comment para lugego introducir en la tabla
       texto: req.body.comment.texto,  // texto que llega del formulario
       QuizId: req.params.quizId  // al comment se le pasa el quizId del quiz para establecer la integridad referencial entre Quiz y Comment. indice secundario de Comment
       });
  var errors = comment.validate();
  if (errors) {
     var i = 0;
     var errores = new Array();
     for (var prop in errors) errores[i++] = {message: errors[prop]};
         res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: errores});
  } else {
         comment    // save: guarda en DB campos pregunta y respuesta de quiz
         .save()
         .then(function() {res.redirect('/quizes/' + req.params.quizId)});
  }
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( {fields: ["publicado"]})
    .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
    .catch(function(error){next(error)});

};