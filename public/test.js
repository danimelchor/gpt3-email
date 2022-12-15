// HOW TO GENERATE THE PROMPT
// Start the prompt with 'reply' or 'generate'

// Background.js
// Listen for a request to check the email subject
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // Check if the message is a request to get the email subject
      if (request.message === "getEmailSubject") {
        // Send a message to the content script to get the email subject
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { message: "getEmailSubject" }, function(response) {
            // Check if the email subject indicates that the email is a reply to another email
            if (response.subject.startsWith("Re:")) {
              // Return a value to indicate that the email is a reply
              sendResponse({ isReply: true });
            } else {
              sendResponse({ isReply: false });
            }
          });
        });
  
        // Return true to indicate that a response will be sent asynchronously
        return true;
      }
  // Content.js
  // Listen for messages from the background script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // Check if the message is a request for the email subject
      if (request.message === "getEmailSubject") {
        // Get the subject of the email that the user is currently composing
        const emailSubject = document.querySelector(
          "input[name=subjectbox]"
        ).value;
  
        // Return the subject to the background script
        sendResponse({ subject: emailSubject });
      }
    }
  );
// Generate the first words of the prompt
// Check if the email is a reply
if (isReply) {
    // Create a prompt with the first words indicating that the email is a reply
    const prompt = "Re: " + emailSubject;
  } else {
    // Create a prompt without indicating that the email is a reply
    const prompt = emailSubject;
  }
  
  // Use the prompt to generate text with the OpenAI API

  // Translate button click in prompt text
  // Listen for clicks on the button
button.addEventListener("click", function() {
    // Indicate that the user wants to write the email in a casual style
    const isCasual = true;
  
    // Create a prompt with the first words indicating that the email is casual
    const prompt = "Casual: " + emailSubject;
  
    // Use the prompt to generate text with the OpenAI API
    // ...
  });
  
// same but with three buttons
// Create three buttons and add them to the page
const casualButton = document.createElement("button");
casualButton.innerHTML = "Write casually";
document.body.appendChild(casualButton);

const friendlyButton = document.createElement("button");
friendlyButton.innerHTML = "Write friendly";
document.body.appendChild(friendlyButton);

const formalButton = document.createElement("button");
formalButton.innerHTML = "Write formally";
document.body.appendChild(formalButton);

// Listen for clicks on the buttons
casualButton.addEventListener("click", function() {
  // Indicate that the user wants to write the email in a casual style
  const style = "casual";

  // Create a prompt with the first words indicating the style of the email
  const prompt = style + ": " + emailSubject;

  // Use the prompt to generate text with the OpenAI API
  // ...
});

friendlyButton.addEventListener("click", function() {
  // Indicate that the user wants to write the email in a friendly style
  const style = "friendly";

  // Create a prompt with the first words indicating the style of the email
  const prompt = style + ": " + emailSubject;

  // Use the prompt to generate text with the OpenAI API
  // ...
});

formalButton.addEventListener("click", function() {
  // Indicate that the user wants to write the email in a formal style
  const style = "formal";

  // Create a prompt with the first words indicating the style of the email
  const prompt = style + ": " + emailSubject;

  // Use the prompt to generate text with the OpenAI API
  // ...
});

// get info from subject and body 
// content.js

function getSubject() {
    // Get the email subject field by its class name
    const subjectField = document.querySelector('.aoT');
    // Return the subject field's text content
    return subjectField.textContent;
  }
  
  function getBody() {
    // Get the email body field by its class name
    const bodyField = document.querySelector('.Am');
    // Return the body field's text content
    return bodyField.textContent;
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'get-email-contents') {
      // When the background script sends a 'get-email-contents' message,
      // send a response with the subject and body of the email
      const subject = getSubject();
      const body = getBody();
      chrome.runtime.sendMessage({
        type: 'email-contents',
        subject,
        body,
      });
    }
  });

  //the part that should go in the background file

  // background.js

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'get-email-contents') {
      // When the content script sends a 'get-email-contents' message,
      // send a message to the content script to retrieve the email contents
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'get-email-contents' });
      });
    } else if (message.type === 'email-contents') {
      // When the content script responds with the email contents,
      // log the subject and body to the console
      const { subject, body } = message;
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
    }
  });
  
  // content.js

// Get the button by its ID
const button9 = document.querySelector('#button9');

// Add an event listener to the button that listens for the 'click' event
button9.addEventListener('click', async () => {
  // Communicate with content script to get the current text
  const [prompt, suffix] = request.text;
  const nextTokens = await getNextTokens(prompt, suffix);

  // Communicate with content script to update the text
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { generate: nextTokens });
  });
});
;
