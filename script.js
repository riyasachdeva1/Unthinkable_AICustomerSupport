const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");


let userMessage;

const API_KEY = "AIzaSyCpqmDMLKLpJsmhyMtkvzD4pe-OEk1ix5k";

const createChatLi = (message, className) => {

  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;

}

const generateResponse = (incomingChatLI) => {

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCpqmDMLKLpJsmhyMtkvzD4pe-OEk1ix5k";
  
  const messageElement = incomingChatLI.querySelector("p");


  const requestOptions = {

    method: "POST",
    headers: {

      "Content-Type": "application/json",

    },
    body: JSON.stringify({
      contents: [{
        parts: [{ "text": userMessage }]
      }]
    }),

  }
    

 
  fetch(API_URL, requestOptions)
  .then(res => res.json())
  .then(data => {
    console.log(data);  
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      
      messageElement.textContent = data.candidates[0].content.parts[0].text || "No content available.";
    } else {
      messageElement.textContent = "Sorry, I couldn't understand the response.";
    }
  })
  .catch((error) => {
    console.error(error);
    messageElement.textContent = "Oops!! Something went wrong. Please try again.";
  })
  .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));


}

const handleChat = () => {

  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {

    const incomingChatLI = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLI);

  }, 600);

}

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

sendChatBtn.addEventListener("click", handleChat);