
  <script>
    const LYZR_API_KEY = "sk-default-phYvRzQpPLvim4wIqsurX37KzYBOwKhY";
    const AGENT_ID = "6901a882e26dd0e036848c05";
    const SESSION_ID = "6901a882e26dd0e036848c05-evuz3e1t18c";
    const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";

    const toggleBtn = document.getElementById('toggleChat');
    const chatContainer = document.getElementById('chatContainer');
    const closeBtn = document.getElementById('closeChat');
    const messagesContainer = document.getElementById('messagesContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendMessage');

    toggleBtn.addEventListener('click', () => chatContainer.classList.toggle('active'));
    closeBtn.addEventListener('click', () => chatContainer.classList.remove('active'));

    // ✅ Enhanced addMessage function with formatting
    function addMessage(text, sender) {
      const msg = document.createElement('div');
      msg.classList.add('message', `${sender}-message`);

      let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
        .replace(/\n/g, '<br>');                           // Line breaks

      msg.innerHTML = formatted;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msg;
    }

    function showTyping(text = "Thinking...") {
      const typingDiv = document.createElement('div');
      typingDiv.classList.add('typing-indicator');
      typingDiv.id = 'typing';
      typingDiv.innerHTML = `
        <span>${text}</span>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
    }

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      addMessage(message, 'user');
      userInput.value = '';
      showTyping("Searching...");

      const payload = {
        user_id: "vaa-user@test.com",
        agent_id: AGENT_ID,
        session_id: SESSION_ID,
        message: message
      };

      try {
        const res = await fetch(LYZR_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": LYZR_API_KEY
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        const botResponse = data.response || "🤖 Sorry, I didn’t catch that.";
        removeTyping();

        showTyping("Thinking...");
        setTimeout(() => {
          removeTyping();
          typeMessage(botResponse, 'bot');
        }, 2000);

      } catch {
        removeTyping();
        addMessage("⚠️ Connection error. Please try again.", 'bot');
      }
    }

    // Typing effect (word-by-word with formatting)
    function typeMessage(text, sender) {
      const msg = addMessage("", sender);
      const words = text.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        let nextWord = words[i] || "";
        let formatted = nextWord
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>');
        msg.innerHTML += (i > 0 ? " " : "") + formatted;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        i++;
        if (i >= words.length) clearInterval(interval);
      }, 80); // typing speed
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
