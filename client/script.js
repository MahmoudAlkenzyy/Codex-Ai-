import bot from './assets/bot.svg';
import user from './assets/user.svg';
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let loadInterval;

/* To Display Loading Dots */
function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}
/* To Display the out put by typing effict */
function typed(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);

            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}
//generate uniqe id
function generateUniqeId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexdecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexdecimalString}`;
}

function chateStripe(isAi, value, uniqueId) {
    return `
<div class="wrapper ${isAi && 'ai'}" > 
  <div class="chat">
    <div class ="profile">
       <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
  
     </div>
     <div class ="message" id=${uniqueId}>
     ${value}
     </div>
  </div>
</div>
  `;
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new FormData(form);

    // user chatstripe
    chatContainer.innerHTML += chateStripe(false, date.get('prompet'));

    form.reset();

    //ai chatestripe
    const uniqueId = generateUniqeId();
    chatContainer.innerHTML += chateStripe(true, ' ', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    // fetch data
    const response = await fetch('https://codex-ai-qinx.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: date.get('prompet') }),
    });
    console.log(response);

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        console.log({ parsedData });

        typed(messageDiv, parsedData);
    } else {
        const err = response.text();
        messageDiv.innerHTML = 'Something went wrong';
        alert(JSON.stringify(err));
        console.log({ parsedData });
    }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});

// fetch('http://localhost:5001/')
//     .then((response) => response.json())
//     .then((data) => {
//         // Handle the retrieved quiz data
//         console.log(data);
//         // You can perform further actions with the data, e.g., render it on the page
//     })
//     .catch((error) => {
//         console.error('Error fetching quiz data:', error);
//     });
