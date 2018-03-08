const model = require('./model');
const {porPantalla, porPantallaGrande, darColor, errorLog} = require('./out');

/*
*	El objeto rl esta creado en el main por eso lo debemos pasar 
*	en la definicion de cada comando
*/


/**
*  Muestra la ayuda
*/
exports.helpCmd = rl => {
	porPantalla("Comandos:");
  		porPantalla(`	${darColor('h|help' , 'green')} - Muestra esta ayuda.`);
  		porPantalla(`	${darColor('list' , 'green')} - Listar los quizzes existentes.`);
  		porPantalla(` 	${darColor('show <id>' , 'green')} - Muestra la pregunta y la respuesta del quiz indicado.`);
  		porPantalla(`	${darColor('add' , 'green')} - Añadir un nuevo quiz interactivamente.`);
  		porPantalla(`	${darColor('delete <id>' , 'green')} - Borrar el quiz indicado.`);
  		porPantalla(`	${darColor('edit <id>' , 'green')} - Editar el quiz indicado.`);
  		porPantalla(`	${darColor('test <id>' , 'green')} - Probar el quiz indicado.`);
  		porPantalla(`	${darColor('p|play' , 'green')} - Jugar a quiz.`);
  		porPantalla(`	${darColor('credits' , 'green')} - Créditos.`);
  		porPantalla(`	${darColor('q|quit' , 'green')} - Salir del programa.`);
  		rl.prompt();
};
/**
*  Sale del programa
*/
exports.quitCmd = rl => {
	rl.close();
	
};

/**
*  Añade quiz
*
*/
exports.addCmd = rl => {
	//porPantalla('Añadir un nuevo quiz.');
	rl.question(darColor('Introduce una pregunta:', 'red'), question =>{
		rl.question(darColor('Introduce la respuesta:', 'red'), answer =>{
			model.add(question, answer);
			porPantalla(`${darColor('Se ha añadido', 'magenta')}: ${question}  ${darColor('=>', 'magenta')}: ${answer}`);
			rl.prompt();
		});
	});
	
};
/**
*  Lista todos los quizzes
*/
exports.listCmd = rl => {
	//porPantalla('Listar los quizzes existentes.');
	model.getAll().forEach((quiz, id) => {

		porPantalla(` [${darColor(id, 'magenta')}]: ${quiz.question}`);

	});
	rl.prompt();
};
/**
*  Muestra un quiz del modelo.
*
*  @param id Clave del quiz a mostrar.
*/
exports.showCmd = (rl, id) => {
	//porPantalla(`Mostrar el quiz indicado ${id}`);
	if (typeof id === "undefined"){
		errorLog(`Falta el parámetro id.`);
	}else{
		try{
			const quiz = model.getByIndex(id);
			porPantalla(`[${darColor(id, 'magenta')}]: ${quiz.question} ${darColor('=>', 'magenta')} ${quiz.answer}`);

		}catch(error){
			errorLog(error.message);
		}
	}

	rl.prompt();

};
/**
*  Borra un quiz del modelo.
*
*  @param id Clave del quiz a borrar.
*/
exports.deleteCmd = (rl, id) => {
	//porPantalla('Borrar el quiz indicado');
	if (typeof id === "undefined"){
		errorLog(`Falta el parámetro id.`);
	}else{
		try{
			model.deleteByIndex(id);
			
		}catch(error){
			errorLog(error.message);
		}
	}

	rl.prompt();
};

/**
*  Edita un quiz del modelo.
*
*  @param id Clave del quiz a editar.
*/
exports.editCmd = (rl, id) => {
	//porPantalla('Editar el quiz indicado');
	if (typeof id === "undefined"){
		errorLog(`Falta el parámetro id.`);
		rl.prompt();
	}else{
		try{
		const quiz = model.getByIndex(id);
		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
		rl.question(darColor('Introduce una pregunta:', 'red'), question =>{
			
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
			rl.question(darColor('Introduce la respuesta:', 'red'), answer =>{
				model.update(id, question, answer);
				porPantalla(`Se ha cambiado el quiz ${darColor(id, 'magenta')} por ${question}  ${darColor('=>', 'magenta')} ${answer}`);
				rl.prompt();
			});
		});
			
		}catch(error){
			errorLog(error.message);
			rl.prompt();
		}
	}

	
	
};
/**
*  Hace una pregunta del modelo a la que debemos contestar.
*
*  @param id Clave del quiz a probar.
*/
exports.testCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorLog(`Falta el parámetro id.`);
		rl.prompt();
	}else{
		try{
			const quiz = model.getByIndex(id);
			//FALTA HACER. acepta min y mayus. tener en cuenta espacios (trim)

			rl.question(darColor(`${quiz.question}?`, 'red'), answer =>{
				const respuesta = answer.trim();
				const respuestaQuiz = quiz.answer;
				if ( respuestaQuiz.toUpperCase() === respuesta.toUpperCase()){
					porPantalla('CORRECTO');
					porPantallaGrande('CORRECTO', 'green');
					rl.prompt();
				}else{
					porPantalla('INCORRECTO');
					porPantallaGrande('INCORRECTO', 'red');
					rl.prompt();
				}
			});
			

		}catch(error){
			errorLog(error.message);
			rl.prompt();
		}
	}

};

/**
*   Pregunta todos los quiz existentes en orden aleatorio.
*   Se gana si se contesta a todos satisfactoriamente.
*  
*/
exports.playCmd = rl => {
	let score = 0;
	//console.log(`${score}`);
	let toBeResolved = [];
	/*for (var i =0; i< model.count(); i++){
		toBeResolved.push(i);
		//console.log(toBeResolved[i]);
	}*/
	toBeResolved = model.getAll();
	//console.log(`${toBeResolved.length}`);

	const random = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	const playOne = () =>{
		if (toBeResolved.length == 0){
			porPantalla(`${darColor('No hay más preguntas', 'green')}`);
			porPantalla(`Fin del juego. Numero de aciertos: ${score}`);
			porPantallaGrande(`${score}`, 'magenta');
			rl.prompt();
		}else{
			
			let id = Math.floor(random(0, toBeResolved.length)); //quitarla del array Math.random()
			
			let quiz = toBeResolved[id];
			
			
			//hacemos pregunta para ese id
			rl.question(`${darColor(quiz.question, 'green')} `, answer =>{
				let respuesta = answer.trim();
				let respuestaQuiz = quiz.answer;
				if ( respuestaQuiz.toUpperCase() === respuesta.toUpperCase()){
					porPantalla('CORRECTO');
					
					score++;
					porPantalla(`Llevas: ${score} aciertos `)
					porPantallaGrande(`${score}`, 'magenta');
					toBeResolved.splice(id, 1);
					/*console.log(`${toBeResolved.length}`);
					for (var i =0; i< toBeResolved.length; i++){
						
						console.log(toBeResolved[i].question);
					}*/
					playOne();
				}else{
					porPantalla('INCORRECTO.');
					porPantalla(`Fin del juego. Aciertos: ${score}`);
					porPantallaGrande(`${score}`, 'magenta');
					rl.prompt();
				}
			
			});


		}
	};
	playOne();
	
};
/**
*   Muestra los nombres de los autores de la practica.
*  
*/
exports.creditsCmd = rl => {
	porPantalla('Autores de la practica:');
	porPantalla('Luis Recio Melero', 'green');
	porPantalla('Jesus Sousa Herranz', 'green');
	rl.prompt();
};


