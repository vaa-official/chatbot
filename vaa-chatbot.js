(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
      *{margin:0;padding:0;box-sizing:border-box;font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;}
      body{background:#f4f6fb;height:100vh;overflow-x:hidden;}
      .toggle-btn{position:fixed;bottom:25px;right:25px;width:65px;height:65px;border-radius:50%;
        background:linear-gradient(135deg,#7AD67A,#37C2A0);display:flex;justify-content:center;
        align-items:center;color:#fff;font-size:28px;border:none;cursor:pointer;
        box-shadow:0 8px 20px rgba(0,0,0,0.25);transition:transform 0.3s ease;z-index:1000;}
      .toggle-btn:active{transform:scale(0.95);}
      .chat-container{position:fixed;bottom:100px;right:25px;width:95%;max-width:380px;height:75vh;
        background:#fff;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.2);
        display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;
        transform:translateY(20px);transition:all 0.3s ease;z-index:999;}
      .chat-container.active{opacity:1;transform:translateY(0);pointer-events:all;}
      .chat-header{background:linear-gradient(135deg,#7AD67A,#37C2A0);color:#fff;padding:15px 20px;
        display:flex;justify-content:space-between;align-items:center;}
      .chat-header h3{font-size:1rem;display:flex;align-items:center;gap:8px;}
      .close-btn{background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;}
      .messages-container{flex:1;padding:15px;overflow-y:auto;background:#f7f9fc;
        display:flex;flex-direction:column;gap:10px;}
      .message{max-width:80%;padding:10px 14px;border-radius:15px;font-size:0.9rem;
        word-wrap:break-word;animation:fadeIn 0.3s ease;}
      @keyframes fadeIn{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
      .bot-message{background:#e7fff0;color:#222;align-self:flex-start;border-bottom-left-radius:5px;
        border:1px solid #c3f0d2;}
      .user-message{background:linear-gradient(135deg,#7AD67A,#37C2A0);color:#fff;
        align-self:flex-end;border-bottom-right-radius:5px;}
      .input-container{display:flex;align-items:center;padding:10px;border-top:1px solid #ddd;
        background:#fff;gap:8px;}
      .message-input{flex:1;padding:10px 15px;border:1px solid #ddd;border-radius:20px;
        outline:none;font-size:1rem;}
      .message-input:focus{border-color:#37C2A0;}
      .send-btn{background:linear-gradient(135deg,#7AD67A,#37C2A0);border:none;color:#fff;
        border-radius:50%;width:45px;height:45px;display:flex;align-items:center;
        justify-content:center;cursor:pointer;}
      .typing-indicator{display:flex;gap:5px;padding:8px 12px;background:#e7fff0;
        border-radius:15px;align-self:flex-start;border:1px solid #c3f0d2;font-size:0.9rem;}
      .typing-dot{width:8px;height:8px;background:#666;border-radius:50%;
        animation:typing 1.4s infinite ease-in-out;}
      .typing-dot:nth-child(1){animation-delay:-0.32s;}
      .typing-dot:nth-child(2){animation-delay:-0.16s;}
      @keyframes typing{0%,80%,100%{transform:scale(0.8);opacity:0.5;}40%{transform:scale(1);opacity:1;}}
      ::-webkit-scrollbar{width:6px;}
      ::-webkit-scrollbar-thumb{background:#37C2A0;border-radius:3px;}
    `;
    document.head.appendChild(style);

    // Load Font Awesome
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fa);

    // Create Chat UI
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.id = "toggleChat";
    toggleBtn.innerHTML = '<i class="fas fa-crown"></i>';

    const chatContainer = document.createElement("div");
    chatContainer.className = "chat-container";
    chatContainer.id = "chatContainer";
    chatContainer.innerHTML = `
      <div class="chat-header">
        <h3><i class="fas fa-robot"></i> VAA Assistant</h3>
        <button class="close-btn" id="closeChat"><i class="fas fa-times"></i></button>
      </div>
      <div class="messages-container" id="messagesContainer">
        <div class="message bot-message">👋 Welcome to VAA Chat! How can I assist you today?</div>
      </div>
      <div class="input-container">
        <input type="text" class="message-input" id="userInput" placeholder="Type your message..." />
        <button class="send-btn" id="sendMessage"><i class="fas fa-paper-plane"></i></button>
      </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(chatContainer);

    // JS Logic
    const LYZR_API_KEY = "sk-default-phYvRzQpPLvim4wIqsurX37KzYBOwKhY";
    const AGENT_ID = "6901a882e26dd0e036848c05";
    const SESSION_ID = "6901a882e26dd0e036848c05-evuz3e1t18c";
    const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";

    const closeBtn = chatContainer.querySelector("#closeChat");
    const messagesContainer = chatContainer.querySelector("#messagesContainer");
    const userInput = chatContainer.querySelector("#userInput");
    const sendBtn = chatContainer.querySelector("#sendMessage");

    toggleBtn.addEventListener("click", () => chatContainer.classList.toggle("active"));
    closeBtn.addEventListener("click", () => chatContainer.classList.remove("active"));

    function addMessage(text, sender) {
      const msg = document.createElement("div");
      msg.classList.add("message", `${sender}-message`);
      let formatted = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
      msg.innerHTML = formatted;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msg;
    }

    function showTyping(text = "Thinking...") {
      const typingDiv = document.createElement("div");
      typingDiv.classList.add("typing-indicator");
      typingDiv.id = "typing";
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
      const typing = document.getElementById("typing");
      if (typing) typing.remove();
    }

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      addMessage(message, "user");
      userInput.value = "";
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
          typeMessage(botResponse, "bot");
        }, 2000);

      } catch {
        removeTyping();
        addMessage("⚠️ Connection error. Please try again.", "bot");
      }
    }

    function typeMessage(text, sender) {
      const msg = addMessage("", sender);
      const words = text.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        let nextWord = words[i] || "";
        let formatted = nextWord
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\n/g, "<br>");
        msg.innerHTML += (i > 0 ? " " : "") + formatted;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        i++;
        if (i >= words.length) clearInterval(interval);
      }, 80);
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });
  });
})();
