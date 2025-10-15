const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");

let userMessage;

//  Store FAQ responses
const FAQs = {
  "what are your working hours": "Our support team is available 24/7 to assist you.",
  "how can i reset my password": "You can reset your password by clicking on 'Forgot Password' at the login page.",
  "where is my order": "Please provide your order ID, and I’ll help you track it.",
  "what payment methods do you accept": "We accept credit cards, debit cards, and digital wallets such as Google Pay and Paytm."
};

// Your Gemini API key
const API_KEY = "AIzaSyCpqmDMLKLpJsmhyMtkvzD4pe-OEk1ix5k";

// Function to create chat elements
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" 
      ? `<p></p>` 
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Generate response using API (if not answered from FAQ)
const generateResponse = (incomingChatLI) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const messageElement = incomingChatLI.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }]
    })
  };

  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      let botReply = "Sorry, I couldn’t process your request right now.";

      // Extract model response safely
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        botReply = data.candidates[0].content.parts[0].text.trim();
      }

      //  Escalation Simulation
      if (
        botReply.toLowerCase().includes("sorry") ||
        botReply.toLowerCase().includes("not sure") ||
        botReply.length < 15
      ) {
        botReply = "I’m not completely sure about that. Let me connect you to a human support agent for further help.";
      }

      messageElement.textContent = botReply;
    })
    .catch(() => {
      messageElement.textContent = "Oops!! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Handle user input and responses
const handleChat = () => {
  userMessage = chatInput.value.trim().toLowerCase();
  if (!userMessage) return;
  chatInput.value = "";

  // Append user message
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLI = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    //  Check if userMessage matches FAQ first
    const faqResponse = Object.keys(FAQs).find(
      q => userMessage.includes(q)
    );

    if (faqResponse) {
      incomingChatLI.querySelector("p").textContent = FAQs[faqResponse];
      chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
      // Otherwise call the API
      generateResponse(incomingChatLI);
    }
  }, 600);
};

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);

