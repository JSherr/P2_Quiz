const fs = require("fs");

//Nombre del fichero donde se guardan las preguntas.
// Es un fichero de texto con el JSON de quizzes.
const DB_FILENAME = "quizzes.json";

/* Array de quizzes 
*  cada posicion de array tiene 2 atributos, por un lado la pregunta
*  y por otro la respuesta
*/
let quizzes = [
	{
		question: "Capital de Italia",
		answer: "Roma"
	},
	{
		question: "Capital de Francia",
		answer: "París"
	},
	{
		question: "Capital de España",
		answer: "Madrid"
	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"
	},
];
const load = () => {

	fs.readFile(DB_FILENAME, (err, data) => {
		if(err) {
			// La primera vez no existe el fichero
			if (err.code  === "ENOENT"){
				save();
				return;
			}
			throw err;
		}

		let json = JSON.parse(data);

		if(json) {
			quizzes = json;
		}
	});
};

const save = () => {

	fs.writeFile(DB_FILENAME,
		JSON.stringify(quizzes),
		err => {
			if(err) throw err;
		});
};

/*  
*  Devuelve cuantos elementos hay en el array, cuantas preguntas hay
*  @return {number} Número de preguntas
*/

exports.count = () => quizzes.length;


/**
*  Añade quiz
*	 trim(). Para quitar espacios por delante y por detras
*	@param question String con la pregunta
*	@param answer respuesta
*/
exports.add = (question, answer) => {
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};
/**
*  Actualiza quiz
*	@param id Clave del quiz
*	@param question String con la pregunta
*	@param answer respuesta
*/
exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new errorLog (`El valor del parametro id no es válido.`);
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

/*
* Devuelve todos los quizzes
* 
* con JSON.parse(JSON.stringify(quizzes));
* creamos una copia del array quizzes
* con stringify primero lo pasams a un string y posteriormente lo devolvemos a un array con parse
*
*  @returns {any}
*/
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

/*
* Devuelve el quiz seleccionado (copia)
* 
* con JSON.parse(JSON.stringify(quizzes));
* creamos una copia del array quizzes
* con stringify primero lo pasams a un string y posteriormente lo devolvemos a un array con parse
*  
*  @param id clave del quiz
*  @returns {question, answer}
*/
exports.getByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		//comprobar si en vez de errorLog es solo Error
		throw new Error (`El valor del parametro id no es válido.`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

/*
* Borra el quiz seleccionado 
*  
*  @param id clave del quiz
*  
*/
exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error (`El valor del parametro id no es válido.`);
	}
	quizzes.splice(id, 1);
	save();
};

// cargamos los quizzes

load();