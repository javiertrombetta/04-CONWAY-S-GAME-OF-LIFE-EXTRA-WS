// En este repo, te ayudaremos a generar el tablero. Tendrás el código inicial para comenzar a trabajar en el proyecto. No te distraigas con los detalles; enfocate en la lógica

// Primero, veamos las dimensiones del tablero (alto y ancho)

const gameOfLife = {
  width: null,
  height: null,
  stepInterval: null, // Guarda el ID del intervalo de tiempo con el que se actualiza el tablero

  createAndShowBoard: function () {
    // Crea el elemento <table>
    const goltable = document.createElement("tbody");

    // Ahora, este bloque construirá la tabla HTML con todas las celdas en estado "dead"
    let tablehtml = "";

    //asigno input de configuración
    this.width = document.getElementById("inputW").value;
    this.height = document.getElementById("inputH").value;


    for (let h = 0; h < this.height; h++)
    {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++)
      {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // El siguiente bloque de código agregará la tabla a #board del DOM. Busca un elemento de id "board" y lo agrega al tablero
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.appendChild(goltable);
    // Una vez que añade los elementos HTML a la página, agregale los eventos a cada celda
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Escribí forEachCell acá. Debe visitar
      cada celda en el tablero. Para eso, llamá a la "iteratorFunc",
      y pasale a la Función la celda y sus coordenadas (x, y).
      Por ejemplo: iteratorFunc(cell, x, y)
    */

    // recorre la tabla y aplica la función iteratorFunc a cada una de las celdas
    for(let h = 0; h < this.height; h++)
    {
      for(let w = 0; w < this.width; w++)
      {        
        let cellId = w + "-" + h;
        let cell = document.getElementById(cellId);
        iteratorFunc(cell, w , h);
      }
    }
  },

  setupBoardEvents: function () {
    
    // Cada celda del tablero tiene un ID CSS con el formato "x-y"
    // en la cual "x" es el eje horizontal e "y" es el vertical.
    // Tené en cuenta esto para loopear a través de todos los IDs.
    // Asignales eventos que permitan al usuario clickear en las
    // celdas para configurar el estado inicial del juego
    // (antes de clickear "Step" o "Auto-Play").

    // 🛎 Recordá: Clickear en una celda debería cambiar su estado (entre "alive" y "dead").
    // Una celda "alive" estará pintada de rojo y una celda "dead" de gris.

    // Tené en cuenta el siguiente modelo para un click event en una sola celda (0-0).
    // 📛 Luego, discutí con tu pareja de pair-programming: ¿Cómo harías para aplicarlo a todo el tablero?

    const onCellClick = function (e) {
      // En el siguiente bloque de código, veremos cómo configurar el estilo de una celda.
      // 🛎 Recordá: this puede hacer referencia a distintas cosas.
      // Usá la consola para entender cuál es su contexto.

      if (this.dataset.status == "dead")
      {
        this.className = "alive"; // muestra gráficamente el estado "alive" de la celda
        this.dataset.status = "alive";
      }
      else
      {
        this.className = "dead"; // muestra gráficamente el estado "dead" de la celda
        this.dataset.status = "dead";
      }
    };

    // añade evento de click en cada celda
    this.forEachCell((cell) => {
      cell.addEventListener("click", onCellClick);
    });

    //const cell00 = document.getElementById("0-0");
    //cell00.addEventListener("click", onCellClick); 
  },

  logica: function(w, h){
    let vecinos = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    let cantidadVivos = 0;
  
    for(let i = 0; i < vecinos.length; i++)
    {
      //vecino en la posicion w-1,h-1 (que es la posicion de mi vecino del casillero del medio con cordenada wh)
      let x = w + vecinos[i][0];
      let y = h + vecinos[i][1];
      const vecinoCell = document.getElementById(x + "-" + y);

      // chequear si existe la celda vecina realmente y también si se encuentra en estado "alive"
        if (vecinoCell && vecinoCell.dataset.status === "alive")
        {
          cantidadVivos++;
        }
    }  
    return cantidadVivos;
  },

  step: function () {
    // La Función step() revisará la situación actual del tablero y lo actualizará, de acuerdo a las reglas del juego.
    // Hacé un bucle que determine si la celda debe estar viva o no, según el estado de sus vecinos.
    // Dentro de esta Función, deberás:
    // 1. Crear un contador para saber cuántos vecinos vivos tiene una celda.
    // 2. Configurar el siguiente estado de todas las celdas (según la cantidad de vecinos vivos).

    //registrar cambios del paso anterior
    this.forEachCell((cell, w , h) => {
      let vecinosVivos = this.logica(w, h);
      if (cell.dataset.status === "alive")
      {
        if (vecinosVivos < 2 || vecinosVivos > 3)
        {
          cell.className = "dead"; // muestra gráficamente el estado "dead" de la celda
          cell.dataset.status = "dead";         
        }
      }
      else
      {
        if (vecinosVivos === 3) {
          cell.className = "alive"; // muestra gráficamente el estado "alive" de la celda
          cell.dataset.status = "alive";          
        }
      }   
    });
  },

  enableAutoPlay: function () {
    // Auto-Play comienza corriendo la Función step() automáticamente.
    // Lo hace de forma repetida durante el intervalo de tiempo configurado previamente.

     if (!this.stepInterval)
     {      
      this.stepInterval = setInterval(() => {
      this.step();
      }, 100);
    }
    else
    {
      clearInterval(this.stepInterval); // hay que blanquear el stepInterval primero
      this.stepInterval = null;
    }
  },

  clear: function () {
    for(let h = 0; h < this.height; h++)
    {
      for(let w = 0; w < this.width; w++)
      {        
        let cellId = w + "-" + h;
        let cell = document.getElementById(cellId);
        cell.dataset.status = "dead";
        cell.className = "dead"; // muestra gráficmente el estado "dead" de la celda
      }
    }
  },

  random: function () {
    for(let h = 0; h < this.height; h++)
    {
      for(let w = 0; w < this.width; w++)
      {        
        let cellId = w + "-" + h;
        let cell = document.getElementById(cellId);

        // usa Math.random() para calcular un valor aleatorio y según lo que toque le asigno "alive" o "dead"
        var aleatorio = Math.random();
        if (aleatorio < 0.5)
        {
          cell.dataset.status = "alive";
          cell.className = "alive"; // muestra gráficamente el estado "alive" de la celda
        }
        else
        {
          cell.dataset.status = "dead";
          cell.className = "dead"; // muestra gráficamente el estado "dead" de la celda
        }        
      }
    }
  },  
};

gameOfLife.createAndShowBoard();

// escucho los eventos de click
document.getElementById("submitBoard").addEventListener("click", () => {  
  gameOfLife.createAndShowBoard();
});
document.getElementById("clear_btn").addEventListener("click", () => {
  gameOfLife.clear();
});
document.getElementById("auto_btn").addEventListener("click", () => {
  gameOfLife.enableAutoPlay();
});
document.getElementById("random_btn").addEventListener("click", () => {
  gameOfLife.random();
});
document.getElementById("step_btn").addEventListener("click", () => {
  gameOfLife.step();
});