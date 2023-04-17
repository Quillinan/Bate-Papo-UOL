axios.defaults.headers.common['Authorization'] = 'TGy2SZYKbVqXoTtLeDl2ZxnL';

let inputName = prompt('Qual é o seu nome?');
let to = 'Todos';
let type = 'Público';
let hourF;

function newName() {
  inputName = prompt(' Nome já inserido no chat! Tente outro...');
}

function connectRoom() {
  const promise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    { name: inputName }
  );

  promise.then(enterChat);
  console.log(promise.then(enterChat));
  promise.catch(newName);
}

function keepConnection() {
  const promise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/status',
    { name: inputName }
  );

  promise.then((res) => res.data);
}

function getMessages() {
  const promise = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  );

  promise.then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      messageOrStatus(res.data[i].type);
      getTime(res.data[i].time);
      loadMessages(
        res.data[i].to,
        res.data[i].from,
        res.data[i].type,
        res.data[i].text
      );
    }
    newMessage(res.data);
  });
}

function messageOrStatus(type) {
  if (type === 'status') typeMessage = 'in-out-color';
  else if (type === 'message') typeMessage = '';
}

function getTime(hour) {
  getHour = hour.split(':')[0];
  hourF = Number(getHour - 3);

  if (hourF <= 0) hourF = (hourF + 12).toString();

  if (hourF < 10) hourF = `0${hourF}`;
  else hourF = hourF.toString();

  dataF = hour.replace(getHour, hourF);
}

function enterChat() {
  setInterval(keepConnection, 5000);
  setInterval(getMessages, 3000);
}

function loadMessages(to, from, type, text) {
  if (type === 'private_message') {
    if (to === inputName || from === inputName) {
      document.querySelector('main').innerHTML += `
              <div class="message reserved-color" data-test="message">
                  <p class="text">
                      <span class="hour">(${dataF})</span>
                      <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}
                  </p>
              </div>
          `;
    }
  } else {
    document.querySelector('main').innerHTML += `
          <div class="message ${typeMessage}">
              <p class="text">
                  <span class="hour">(${dataF})</span>
                  <strong>${from}</strong> para <strong>${to}</strong>: ${text}
              </p>
          </div>
      `;
  }
}

function sendMessage() {
  let messageInput = document.querySelector('footer input');

  let messageValues = {
    from: inputName,
    to: to,
    text: messageInput.value,
    type: type,
  };

  const promise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    messageValues
  );

  promise.then((res) => res.data);
  promise.catch((err) => {
    alert(`${err.response.status} Usuário saiu da sala`);
    window.location.reload();
  });

  messageInput.value = '';
}
