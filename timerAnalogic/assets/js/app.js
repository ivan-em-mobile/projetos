    var numberHours = document.querySelector(".number_hours");
    var secondsBar = document.querySelector(".seconds_bar");

    var numberElement = [];
    var barElement = [];

    for (let i = 1; i <= 12; i++) {
      numberElement.push(`<span style="--index:${i}"><p>${i}</p></span>`);
    }
    numberHours.insertAdjacentHTML("afterbegin", numberElement.join(""));

    for (let i = 1; i <= 60; i++) {
      barElement.push(`<span style="--index:${i}"><p></p></span>`);
    }
    secondsBar.insertAdjacentHTML("afterbegin", barElement.join(""));

    // Time
    const handHours = document.querySelector(".hand.hour");
    const handMinutes = document.querySelector(".hand.minute");
    const handSeconds = document.querySelector(".hand.second");

    // Obtém a referência para o elemento de áudio
    const tickSound = document.getElementById("tickSound");

    function getCurrentTime() {
      let date = new Date();
      let currentHours = date.getHours();
      let currentMinutes = date.getMinutes();
      let currentSeconds = date.getSeconds();

      handHours.style.transform = `rotate(${
        currentHours * 30 + currentMinutes / 2
      }deg)`;

      handMinutes.style.transform = `rotate(${currentMinutes * 6}deg)`;

      handSeconds.style.transform = `rotate(${currentSeconds * 6}deg)`;

      // Reproduz o som do tick
      if (tickSound) {
        tickSound.currentTime = 0; // Reinicia o som para permitir reprodução a cada segundo
        tickSound.play();
      }
    }

    getCurrentTime();

    // Chama getCurrentTime para atualizar os ponteiros do relógio a cada segundo
    setInterval(getCurrentTime, 1000);