var models = require('../models/models.js');

// Autoload - factoriza el c�digo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find({
     where: { id: Number(quizId) },
     include: [{model: models.Comment }]
   }).then(
      function(quiz) {
        if(quiz) {
          req.quiz = quiz;
          next();
        } else { next(new Error('No existe quizId=' + quizId));}
      }
    ).catch(function(error) { next(error);});
};

// POST /quizes/create
exports.create = function (req, res) {
var quiz= models.Quiz.build(req.body.quiz);

var errors = quiz.validate();
if (errors)
{
   res.render('quizes/new', {quiz: quiz, errors: errors});
} else {
   quiz // save: guarda en DB campos pregunta y respuesta de quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    .then( function(){ res.redirect('/quizes')}) ;
}
};


// GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
       res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
 models.Quiz.find(req.params.quizId).then(function(quiz) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
    res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, 
      errors: [] });
 })
};

// GET /quizes con busqueda
exports.index = function(req, res){
  if(req.query.search) {
    var filtro = (req.query.search || '').replace(" ", "%");
    models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta'}).then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) { next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) { next(error);});
  }
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build( // Crea objeto Quiz
  {pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'Ocio'}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; // autoload de intancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
     var quiz= models.Quiz.build(req.body.quiz);

     req.quiz.pregunta = req.body.quiz.pregunta;
     req.quiz.respuesta = req.body.quiz.respuesta;
     req.quiz.tema = req.body.quiz.tema;

     var errors = quiz.validate();
     if(errors){
           res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
     } else {
            quiz  // save: guarda campos pregunta y respuesta en DB
            .save( {fields: ["pregunta", "respuesta", "tema"]})
             .then( function(){ res.redirect('/quizes');});
     }  // Redirecci�n HTTP a lista de preguntas (URL relativo)
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
