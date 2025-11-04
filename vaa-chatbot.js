<script>
(function () {
  // === Lyzr Agent Configuration ===
  const LYZR_API_KEY = "sk-default-phYvRzQpPLvim4wIqsurX37KzYBOwKhY";
  const AGENT_ID = "6901a882e26dd0e036848c05";
  const SESSION_ID = "6901a882e26dd0e036848c05-evuz3e1t18c";
  const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";

  // === Create Chat Button ===
  const chatBtn = document.createElement("button");
  chatBtn.id = "vaaChatBtn";
  chatBtn.innerHTML = '<i style="font-size:20px" class="fa fa-comments"></i>';
  Object.assign(chatBtn.style, {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
    zIndex: "9999",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  chatBtn.addEventListener("mouseenter", () => (chatBtn.style.backgroundColor = "#0056b3"));
  chatBtn.addEventListener("mouseleave", () => (chatBtn.style.backgroundColor = "#007bff"));

  // === Create Chat Box ===
  const chatBox = document.createElement("div");
  chatBox.id = "vaaChatBox";
  Object.assign(chatBox.style, {
    display: "none",
    position: "fixed",
    bottom: "90px",
    right: "25px",
    width: "360px",
    height: "500px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    overflow: "hidden",
    zIndex: "10000",
    display: "flex",
    flexDirection: "column",
  });

  // === Header ===
  const header = document.createElement("div");
  header.style.background = "#007bff";
  header.style.color = "#fff";
  header.style.padding = "10px 15px";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.fontWeight = "500";
  header.innerHTML = `
    <span>VAA Chatbot</span>
    <button id="vaaCloseBtn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">&times;</button>
  `;

  // === Message Container ===
  const messages = document.createElement("div");
  Object.assign(messages.style, {
    flex: "1",
    padding: "10px",
    overflowY: "auto",
    fontSize: "14px",
    background: "#f8f9fa",
  });

  // === Input Area ===
  const inputArea = document.createElement("div");
  Object.assign(inputArea.style, {
    display: "flex",
    borderTop: "1px solid #ddd",
  });

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type your message...";
  Object.assign(input.style, {
    flex: "1",
    border: "none",
    padding: "10px",
    outline: "none",
  });

  const sendBtn = document.createElement("button");
  sendBtn.innerHTML = "Send";
  Object.assign(sendBtn.style, {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0 15px",
    cursor: "pointer",
  });

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);

  // === Append Structure ===
  chatBox.appendChild(header);
  chatBox.appendChild(messages);
  chatBox.appendChild(inputArea);
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatBox);

  // === Toggle Chat Box ===
  chatBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
  });
  header.querySelector("#vaaCloseBtn").addEventListener("click", () => {
    chatBox.style.display = "none";
  });

  // === Message Helper ===
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.style.margin = "8px 0";
    msg.style.padding = "8px 10px";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "80%";
    msg.style.wordBreak = "break-word";
    msg.style.background = sender === "user" ? "#007bff" : "#e9ecef";
    msg.style.color = sender === "user" ? "#fff" : "#000";
    msg.style.alignSelf = sender === "user" ? "flex-end" : "flex-start";
    msg.style.textAlign = sender === "user" ? "right" : "left";
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // === Lyzr Chat Function ===
  async function sendToLyzr(message) {
    try {
      const response = await fetch(LYZR_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LYZR_API_KEY}`,
        },
        body: JSON.stringify({
          agent_id: AGENT_ID,
          session_id: SESSION_ID,
          input: message,
        }),
      });

      const data = await response.json();
      if (data.output) {
        addMessage("bot", data.output);
      } else {
        addMessage("bot", "⚠️ Sorry, I didn’t understand that.");
      }
    } catch (err) {
      console.error("Error:", err);
      addMessage("bot", "⚠️ Connection error. Please try again.");
    }
  }

  // === Handle Send Button ===
  sendBtn.addEventListener("click", () => {
    const userMsg = input.value.trim();
    if (!userMsg) return;
    addMessage("user", userMsg);
    input.value = "";
    sendToLyzr(userMsg);
  });

  // === Handle Enter Key ===
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });
})();
</script>
