// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta:  DataTypes.STRING,
      respuesta: DataTypes.STRING,
    });
}