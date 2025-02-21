const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const togglePaletteButton = document.getElementById('toggle-palette-button');
const toggleVideosButton = document.getElementById('toggle-videos-button');
const videoContainer = document.getElementById('video-container');
const professionalButton = document.getElementById('professional-button');
const coolButton = document.getElementById('cool-button');
const goofyButton = document.getElementById('goofy-button');

let currentPrompt = "You are a cool assistant. Use casual language and be friendly.";

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

togglePaletteButton.addEventListener('click', () => {
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

toggleVideosButton.addEventListener('click', () => {
    if (videoContainer.style.display === 'none') {
        videoContainer.style.display = 'flex';
    } else {
        videoContainer.style.display = 'none';
    }
});

professionalButton.addEventListener('click', () => {
    currentPrompt = "You are a professional assistant. Provide concise and accurate information.";
    setActiveButton(professionalButton);
});

coolButton.addEventListener('click', () => {
    currentPrompt = "You are a cool assistant. Use casual language and be friendly.";
    setActiveButton(coolButton);
});

goofyButton.addEventListener('click', () => {
    currentPrompt = "You are a goofy assistant. Be humorous and entertaining.";
    setActiveButton(goofyButton);
});

function setActiveButton(activeButton) {
    const buttons = [professionalButton, coolButton, goofyButton];
    buttons.forEach(button => {
        if (button === activeButton) {
            button.classList.add('active-prompt');
        } else {
            button.classList.remove('active-prompt');
        }
    });
}

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
        body: JSON.stringify({ prompt: currentPrompt, message: message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botResponse += decoder.decode(value);
    }

    // Format the response
    const formattedResponse = formatBotResponse(botResponse);

    chatMessages.removeChild(loadingElement);
    addMessage('bot', formattedResponse);
}

function formatBotResponse(text) {
    // Add non-breaking space before punctuation marks
    text = text.replace(/\s([.,?!])/g, '&nbsp;$1');
    return text;
}

// Set the default active button to "Cool"
setActiveButton(coolButton);

// Add this at the end of your script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Set Cool button as active by default
    coolButton.classList.add('active-prompt');
});

