document.addEventListener("DOMContentLoaded", (event) => {
 
  function User(name, id, cell, money, color) {
    this.name = name;
    this.id = id;
    this.cell = cell;
    this.money = money;
    this.color = color;
    this.hello = function () {
      console.log(`Hello ${this.name}`);
    }
  }

  const gameDB = {
    users: 0,
    cells: {}
  };

  const logs = document.querySelector('.monopoly__logs');


  for (let i = 0; i < 1; i++) {
    const count = +prompt("Введите количество игроков", "");

    if (count != null && count != '' && count < 6 && count > 0) {
      gameDB.users = count;
    } else {
      alert('Количество игроков должно быть от 1 до 5');
      i--;
    }
  }



  

  //формируем массив игроков
  const usersBox = document.querySelector('.monopoly__users');
  //const usersCells = document.querySelectorAll(".cell").dataset;


  
  let gamers = [];
  const colors = ['red', 'green', 'blue', 'black', 'yellow'];

  //let callback = movePlayer;

  function createUsers() {
    for (let i = 1; i <= gameDB.users; i++) {
      let name = prompt(`Введите имя игрока ${i}`, "");
      let user = new User(name, i, 0, 15000000);
      let color = colors[i - 1];
      user.id = i;
      user.color = color;
      gamers[i - 1] = user;
      generateUsersCards(user.id, user.name, user.money, user.color);
      document.querySelector(`.cell[data-num="0"]`).innerHTML += `<div class="pin pin-${user.color}" data-user="${user.id}"></div>`;
    }
    // setTimeout(() => {
    //   callback();
    // }, 700 );

  }
  
  createUsers();
  
  function generateUsersCards(id, name, money, color) {
    const userItem = document.createElement('div');
    userItem.classList.add('user');
    userItem.classList.add(color);
    userItem.dataset.id = id;
    userItem.innerHTML += `
          <div class="user__name">${name}</div>
          <div class="user__money">${money}</div>
          <div class="user__help">
            <div class="info"></div>
            <button class="btn btn-ask">Помощь друга</button>
            <button class="btn btn-help">Помочь другу</button>
          </div>`;
    usersBox.append(userItem);
    
  }




  //формируем поле карточек прибыли и потерь рандомно

  const cells = document.querySelectorAll('.cell');
  const countCells = cells.length - 1;
  

 
  // 50% ячеек заполняем событиями
  const countEvent = Math.round(countCells / 100 * 50);

  // 30% - на потерю
  const countLost = Math.round(countEvent / 100 * 70);

  // 20% - на прибыль
  const countFound = Math.round(countEvent / 100 * 30);



  function installEventCell(param, money, cell, num) {
    if (param == 'plus') {
      cells[cell].textContent = '+' + money;
      cells[cell].style.background = "#00BA88";
      cells[cell].style.color = "#FFF";
      
    }
    if (param == 'minus') {
      cells[cell].textContent = '-' + money;
      cells[cell].style.background = "#FF3000";
      cells[cell].style.color = "#FFF";
    }
    cells[cell].dataset.event = param;
    cells[cell].dataset.summ = num;

  }



  function generateCellEvent() {
    let arrEventCell = []; //занятые ячейки
    const maxMoney = 1100000; //максимальная потеря и приобретение миллион
    const minMoney = 300000; //минимальная потеря и приобретение 300 000
    //для прибыли
    for (let j = 1; j <= countFound; j++) {
      // вычисляем рандомную сумму
      let randomMoney = Math.floor(Math.random() * (maxMoney - minMoney + 1) + minMoney);
      randomMoneyInt = Math.round(randomMoney / 1000) * 1000;
      randomMoney = randomMoneyInt.toLocaleString();
  
      // вычисляем рандомную ячейку
      let randomCell = Math.floor(Math.random() * (countCells - 1 + 1) + 1);
  
      //проверяем занята ли уже ячейка
      if (!arrEventCell.includes(randomCell)) {
        arrEventCell[j - 1] = randomCell;
        installEventCell('plus', randomMoney, randomCell, randomMoneyInt);
      } else {
        j--;
      }
    }
    //для убытков
    for (let j = 1; j <= countLost; j++) {
      // вычисляем рандомную сумму
      let randomMoney = Math.floor(Math.random() * (maxMoney - minMoney + 1) + minMoney);
      randomMoneyInt = Math.round(randomMoney / 1000) * 1000;
      randomMoney = randomMoneyInt.toLocaleString();
      // вычисляем рандомную ячейку
      let randomCell = Math.floor(Math.random() * (countCells - 1 + 1) + 1);
      if (!arrEventCell.includes(randomCell)) {
        arrEventCell[j - 1] = randomCell;
        installEventCell('minus', randomMoney, randomCell, randomMoneyInt);
      } else {
        j--;
      }
     
    }
  }
  generateCellEvent();

  //Игральный кубик выкидывает рандомное число
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  
  const helpBtns = document.querySelectorAll('.btn-help');
  let userСurrent;
  let userСurrentMoney;
  let userСurrentHelpBtn;
  let userСurrentAskBtn;
  let userСurrentHelpMess;
  let userHelper;


  function movePlayer(gamer = gamers[0]) {

    alert(`Ход игрока ${gamer.name}`);
    //получаем значение кубика
    const dice = getRandomInt(2, 6);
    const diceResult = confirm(`Кубики выпали с результатом ${dice}`);

    // перемещаемся
    document.querySelector(`.cell [data-user="${gamer.id}"]`).remove();
    
    gamer.cell = gamer.cell + dice;

    if (gamer.cell > countCells) {
      let num = parseInt(gamer.cell) - parseInt(countCells);
      gamer.cell = num-1;
    } 


    let currentCell = document.querySelector(`.cell[data-num="${gamer.cell}"]`);
    let currentPrice = gamer.money;
    let dataEvent = currentCell.dataset.event;
    let dataSumm = currentCell.dataset.summ;

    userСurrent = usersBox.querySelector('.current');
    userСurrentMoney = userСurrent.querySelector('.user__money');
    userСurrentHelpBtn = userСurrent.querySelector('.btn-help');
    userСurrentAskBtn = userСurrent.querySelector('.btn-ask');
    userСurrentHelpMess = userСurrent.querySelector('.info');
    
    


    currentCell.innerHTML += `<div class="pin pin-${gamer.color}" data-user="${gamer.id}"></div>`;
    
    
    let summ;
  

    userСurrentAskBtn.addEventListener('click', () => {

      for (let i = 0; i < 1; i++) {
        const mess = +prompt("Какую сумму вы хотите попросить?", "");
        if (mess != null && mess != '' && mess < 2000000 && mess > 0) {
          userСurrent.classList.add('need-help');

          userСurrentHelpMess.textContent = `Нужно ${mess} монет`;
          summ = mess;
          createLogs(gamer.name, 'help', mess);
          
        } else {
          alert('Проверьте корректность суммы. Сумма не больше 2 млн');
          i--;
        }
        
      }
    });

    userСurrentHelpBtn.addEventListener('click', (e) => {



      const result = confirm("Списать ваши монеты?");

      let curGamer = gamers[userСurrent.dataset.id - 1];
    
      
          if (result) {
            createLogs(curGamer.name, 'send', summ, gamer.name);
            
            curGamer.money = parseInt(curGamer.money) + parseInt(summ);
            gamer.money = parseInt(gamer.money) - parseInt(summ);


            userСurrent.querySelector('.user__money').textContent = curGamer.money;
            userHelper = usersBox.querySelector(`[data-id="${gamer.id}"]`);

            userСurrent.querySelector('.user__money').textContent = gamer.money;
            userHelper.querySelector('.user__money').textContent = curGamer.money;
            userHelper.classList.remove('need-help');
            userHelper.querySelector('.info').textContent = '';

        }
    });




    if (dataEvent) {
      if (dataEvent == "plus") {
        alert(`Вы получаете ${dataSumm} монет`);
        createLogs(gamer.name, dataEvent, dataSumm);
        gamer.money = parseInt(gamer.money) + parseInt(dataSumm);
        userСurrentMoney.textContent = gamer.money;
      }
      if (dataEvent == "minus") { 
        alert(`Вы теряете ${dataSumm} монет`);
        createLogs(gamer.name, dataEvent, dataSumm);
        gamer.money = parseInt(gamer.money) - parseInt(dataSumm);
        userСurrentMoney.textContent = gamer.money;



        if (currentPrice < 0 && currentPrice < 5000000) {
          alert(`Игра окончена. Вы проиграли  ${dataSumm}`);
          createLogs(gamer.name, 'gameOver', dataSumm);
          document.querySelector(`.user[data-id="${gamer.id+1}"]`).classList.add('remove');
          gamer.remove();
        }
        
      }

    }
    


  }



  function createLogs(gamer, event, summ, helper) {
    const logItem = document.createElement('div');
    logItem.classList.add('log');
    

    if (event == 'plus') {
      logItem.innerHTML += `Игрок ${gamer} получает ${summ} монет`;

    }
    if (event == 'minus') {
      logItem.innerHTML += `Игрок ${gamer} теряет ${summ} монет`;
    }
    if (event == 'gameOver') {
      logItem.innerHTML += `Игрок ${gamer} выбывает из игры`;
    }
    if (event == 'help') {
      logItem.innerHTML += `Игрок ${gamer} просит ${summ} монет`;
    }
    if (event == 'send') {
      logItem.innerHTML += `Игрок ${gamer} дает ${summ} монет игроку ${helper}`;
    }

    logs.append(logItem);
      

  }




  const btnStart = document.querySelector('.start');
  const btnNext = document.querySelector('.next');
  let current;

  btnNext.style.display = "none";
  btnStart.addEventListener('click', () => {
    document.querySelector('.user[data-id="1"]').classList.add('current');
    current = 0;
    movePlayer(gamers[0]); 
    btnStart.style.display = "none";
    btnNext.style.display = "block";
  });
  btnNext.addEventListener('click', () => {

    document.querySelectorAll('.user').forEach((item) => {
      if (item.classList.contains('current')) {
        item.classList.remove('current');
      }
    });


    current = current + 1;
    if (current < gamers.length) {
      document.querySelector(`.user[data-id="${gamers[current].id}"]`).classList.add('current');
      movePlayer(gamers[current]); 

    } else {
        current = 0;
        document.querySelector(`.user[data-id="1"]`).classList.add('current');
        movePlayer(gamers[0]); 
      }

  });

});