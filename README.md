Использовала простые браузерные модалки для скорости.

Игровое поле.

Для игрового поля ячейки с событиями генерируются рандомно. То есть нет фиксированного  поля событий, с каждым перезапуском все меняется.  
Такая схема(ее можно перенастроить):
50% ячеек заполняем событиями
30% - на потерю
20% - на прибыль

Также рандомно выставляются цифры в ячейках прибыли и убытков.  В коде есть минимальный и максимальный параметр для цифры.

Кубик - рандомайзер (взяла 1 кубик). Оповещение в начале хода игрока какой стороной выпал. И сразу же перемещаемся фишкой активного игрока(чей ход сейчас) в зависимости от кубика.

Сначала пользователь задает количество игроков, в зависимости от которого генерятся карточки. Потом задаем имена. Фишки присваиваются автоматически.

После хода, перед тем как передать ход другому в карточке игрока появляется кнопка "Помощь друга" (там можно запросить сумму которая тебе нужна. При этим появится в карточке оповещение. 

Следующий игрок в свой ход увидит на поле запросившего деньги кнопку Помочь другу. При клике сумма спишется со счета текущего игрока в пользу просившего. 

Логируются денежные операции.
