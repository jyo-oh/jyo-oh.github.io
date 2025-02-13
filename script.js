const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('toggle-palette-button').addEventListener('click', () => {
    if (document.body.classList.contains('green-black-palette')) {
        document.body.classList.remove('green-black-palette');
        document.body.classList.add('rainbow-white-palette');
    } else if (document.body.classList.contains('rainbow-white-palette')) {
        document.body.classList.remove('rainbow-white-palette');
        document.body.classList.add('green-black-palette');
    } else {
        document.body.classList.add('green-black-palette');
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage('user', message);
        userInput.value = '';
        fetchBotResponse(message);
    }
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    const timestamp = new Date().toLocaleTimeString();
    const timestampElement = document.createElement('span');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = ` [${timestamp}]`;

    messageElement.textContent = message;
    messageElement.appendChild(timestampElement);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchBotResponse(message) {
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading');
    loadingElement.innerHTML = '<div class="spinner"></div>';
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const response = await fetch('https://odd-forest-5171.joshuaoh0902.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botResponse += decoder.decode(value);
    }

    chatMessages.removeChild(loadingElement);
    addMessage('bot', botResponse);
}

