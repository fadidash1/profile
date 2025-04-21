const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbot = document.getElementById('close-chatbot');

let isLoading = false;
let isChatbotOpen = false;

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    isChatbotOpen = !isChatbotOpen;
    if (isChatbotOpen) {
        chatbotContainer.classList.remove('hidden');
        setTimeout(() => {
            chatbotContainer.classList.add('visible');
        }, 10);
        // Add welcome message if chat is empty
        if (chatContainer.children.length === 0) {
            appendMessage("Hello! I'm your Social Media Marketing Assistant. How can I help you today?", 'bot');
            addQuickReplies();
        }
    } else {
        chatbotContainer.classList.remove('visible');
        setTimeout(() => {
            chatbotContainer.classList.add('hidden');
        }, 300);
    }
});

closeChatbot.addEventListener('click', () => {
    isChatbotOpen = false;
    chatbotContainer.classList.remove('visible');
    setTimeout(() => {
        chatbotContainer.classList.add('hidden');
    }, 300);
});

const packages = {
    STARTER: {
        price: "€600/month",
        platforms: ["Instagram", "Facebook"],
        includes: [
            "8-10 posts/month (images, carousels, short videos)",
            "Basic design and copywriting",
            "3 posts per week with optimized hashtags",
            "Community interaction (comments and DM responses)",
            "Monthly performance reports",
            "€200 included ad budget"
        ],
        bestFor: "Small businesses and startups"
    },
    GROWTH: {
        price: "€1,500/month",
        platforms: ["Instagram", "Facebook", "TikTok"],
        includes: [
            "15-20 posts/month (mix of images, carousels, videos, Reels)",
            "Professional design and copywriting",
            "5 posts per week",
            "Daily community management",
            "Biweekly reports with analysis",
            "Management of 1 ad campaign (budget not included)"
        ],
        bestFor: "Growing businesses wanting more visibility"
    },
    PREMIUM: {
        price: "€3,000/month",
        platforms: ["Instagram", "Facebook", "TikTok", "LinkedIn", "Pinterest"],
        includes: [
            "25-30 posts/month (videos, carousels, advanced graphics)",
            "Advanced copywriting and video editing",
            "Daily optimized content",
            "24/7 community management",
            "Weekly performance reports",
            "Management of 2 ad campaigns with A/B testing",
            "1 influencer collaboration per month"
        ],
        bestFor: "Established brands wanting maximum conversions"
    }
};

function formatPackageDetails(pkg, name) {
    return `Our ${name} PACKAGE (${pkg.price}) includes:\n
• Platforms: ${pkg.platforms.join(', ')}\n
• ${pkg.includes.join('\n• ')}\n\nBest for: ${pkg.bestFor}`;
}

function getLocalResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes("starter")) return formatPackageDetails(packages.STARTER, "STARTER");
    if (msg.includes("growth")) return formatPackageDetails(packages.GROWTH, "GROWTH");
    if (msg.includes("premium")) return formatPackageDetails(packages.PREMIUM, "PREMIUM");

    if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
        return `Our packages are priced as follows:\n
- Starter: ${packages.STARTER.price}
- Growth: ${packages.GROWTH.price}
- Premium: ${packages.PREMIUM.price}`;
    }

    if (msg.includes("small business") || msg.includes("startup")) {
        return `For small businesses, I recommend the STARTER PACKAGE (${packages.STARTER.price}). It includes:\n
• ${packages.STARTER.includes.slice(0, 3).join('\n• ')}\n\nTailored specifically for: ${packages.STARTER.bestFor}.`;
    }

    if (msg.includes("best") || msg.includes("recommend")) {
        return `Recommendations based on your needs:\n
- Starter: Basic presence – ${packages.STARTER.price}
- Growth: More visibility – ${packages.GROWTH.price}
- Premium: Max conversions – ${packages.PREMIUM.price}\n\nTell me more about your goals?`;
    }

    return `I can help you choose the perfect marketing package. Ask me about the Starter, Growth, or Premium plans!`;
}

async function fetchResponse(userMsg) {
    if (isLoading) return;
    isLoading = true;
    sendButton.disabled = true;
    showTyping();

    await new Promise(res => setTimeout(res, 800)); // Simulated delay
    const reply = getLocalResponse(userMsg);
    appendMessage(reply, 'bot');

    hideTyping();
    isLoading = false;
    sendButton.disabled = false;

    addQuickReplies();
}

function appendMessage(text, sender) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    messageDiv.innerHTML = `
        <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
        <div class="timestamp text-xs mt-1 ${sender === 'user' ? 'text-teal-600' : 'text-purple-600'}">
            ${sender === 'user' ? 'You' : 'Assistant'} • ${timestamp}
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = 'typing-indicator';
    typing.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatContainer.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function addQuickReplies() {
    // Remove existing quick replies if any
    const existingReplies = document.querySelector('.quick-replies-container');
    if (existingReplies) existingReplies.remove();

    const replies = [
        "Tell me about the Starter Package",
        "What's included in Growth Package?",
        "How much is Premium Package?",
        "Which package is best for small business?"
    ];

    const container = document.createElement('div');
    container.className = 'quick-replies-container mt-2';

    replies.forEach(text => {
        const btn = document.createElement('div');
        btn.className = 'quick-reply';
        btn.textContent = text;
        btn.onclick = () => {
            messageInput.value = text;
            sendButton.click();
        };
        container.appendChild(btn);
    });

    chatContainer.appendChild(container);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener('click', async () => {
    const userText = messageInput.value.trim();
    if (!userText || isLoading) return;

    appendMessage(userText, 'user');
    messageInput.value = '';
    await fetchResponse(userText);
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});