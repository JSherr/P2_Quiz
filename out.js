const figlet = require('figlet');
const chalk = require('chalk');
/**
*	Dar color a un string
*	@param msg      Es el string al que hay que dar color
*	@param color 	Es el color con el que se va a pintar el string
*	@returns {string}   Devuelve el string msg con el color indicado
*/
const darColor = (msg, color) => {
	if (typeof color !== "undefined"){
		msg = chalk[color].bold(msg);
	}
	return msg;
};
/**
*	Escribe un mensaje de log
*	
*	@param msg      Es el string al que hay que dar color
*	@param color 	Es el color con el que se va a pintar el string
*	
*/
const porPantalla = (msg, color) =>{
	console.log(darColor(msg, color));
};
/**
*	Escribe un mensaje de log grande
*	
*	@param msg      Es el string al que hay que dar color
*	@param color 	Es el color con el que se va a pintar el string
*	
*/
const porPantallaGrande = (msg, color) =>{
	porPantalla(figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};
/**
*	Escribe un mensaje de error
*	
*	@param emsg     texto del mensaje de error
*	
*/
const errorLog = (emsg) => {
	console.log(`${darColor("ERROR", "red")}: ${darColor(darColor(emsg, "red"), "bgYellowBright")}`);
};

exports = module.exports ={
	darColor,
	porPantalla,
	porPantallaGrande,
	errorLog
};