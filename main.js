
const readline = require('readline');
const cmds = require('./cmds');
const {porPantalla, porPantallaGrande, darColor, errorLog} = require('./out');


porPantallaGrande('CORE Quiz', 'green');
//const hola = 'hola Luis';
//console.log(hola.toUpperCase());


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: darColor("quiz > ", "blue"),
  /*
  *	  FUNCIÓN DE AUTOCOMPLETAR
  */
  completer: (line) => {
	  const completions = 'h help add delete edit list test p play credits quit q show'.split(' ');
	  const hits = completions.filter((c) => c.startsWith(line));
	  // show all completions if none found
	  return [hits.length ? hits : completions, line];
}
});

rl.prompt();

rl.on('line', (line) => {
  /*
  *  Con el objetivo de pasar a las funciones el
  *  parametro id vamos a coger la línea introducida
  *  y trocearla con espacios split(" ") y se pasamos cmd al switch
  */
  let args = line.split(" ");
  let cmd = args[0].toLowerCase().trim();

  // pasamos el rl como primer argumento

  switch (cmd) {
  	case '':
  		rl.prompt();
  		break;
  	case 'h':
  	case 'help':
  		cmds.helpCmd(rl);
  		break;
    case 'quit':
    case 'q':
     	cmds.quitCmd(rl);
     	break;

    case 'add':
    	cmds.addCmd(rl);
    	break;

    case 'list':
		cmds.listCmd(rl);
		break;

	case 'test':
		cmds.testCmd(rl, args[1]);
		break;

	case 'show':
	/*
	*  args[1] será el id
	*/
		cmds.showCmd(rl, args[1]);   
    	break;

    case 'delete':
    	cmds.deleteCmd(rl, args[1]);
    	break;

    case 'edit':
    	cmds.editCmd(rl, args[1]);
    	break;

    case 'p':
    case 'play':
    	cmds.playCmd(rl);
    	break;

    case 'credits':
    	cmds.creditsCmd(rl);
    	break;


    default:
      porPantalla(`Comando desconcido: '${darColor(cmd, 'red')}'`);
      porPantalla(`Use ${darColor('help', 'green')} para ver todos los comandos disponibles.`);
      rl.prompt();
      break;
  }
 

}).on('close', () => {
  porPantalla('Adios');
  process.exit(0);
});

