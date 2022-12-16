// Define a variable and a constant
var LAST_ACTIVE_EL = null;

// Takes the text from the gmail box
const extractText = () => {
    // Define a variable to hold the extracted text
    var txt = LAST_ACTIVE_EL.innerText;
    // Replace any consecutive whitespace characters with a single space
    txt = txt.replace(/(\s)+/g, "$1");
    // Remove leading and trailing whitespace
    txt = txt.trim();
    // Return the entire text as a single string
    return txt;
  };

// Insert text as HTML
const insertText = (text) => {
    // Get the entire text from the Gmail box
    const txt = extractText();
  
    // Split the text at newline characters
    const spl_text = text.split("\n");
    // Define a variable to hold the resulting HTML string
    var res = "";
  
    // Further formatting of the HTML
    for (const s of spl_text) {
      if (s == "") {
        // Add a white line if there is no text
        res += "<div><br></div>";
      } else {
        // Add the text if there is text
        res += "<div>" + s + "</div>";
      }
    }
  
    // Insert text at the beginning or end of the existing text in the Gmail box
    LAST_ACTIVE_EL.innerHTML = txt + res;
};

const createPromptBox = async () => {
    fetch(chrome.runtime.getURL("promptbox.html")).then(res=>res.text()).then(promptboxHTML => {
        // Append table to parent of input
        var promptboxTemplate = document.createElement('template')
        promptboxTemplate.innerHTML = promptboxHTML.trim()
        promptboxElement = LAST_ACTIVE_EL.parentNode.appendChild(promptboxTemplate.content.firstChild)
    })
};

// Deletes the prompt box
const deleteButton = () => {
    const button = document.getElementById("promptbox");
    if (button != null) button.remove();
};

// What is the use of this piece of the text?
const getAllEditable = () => {
    return document.querySelectorAll("div[contenteditable=true]");
};

//changed this to button 9 to see if it works on my button
const setButtonLoading = () => {
    const button9 = document.getElementById("generate-button");
    button9.innerHTML = "<div class='spinner'></div>";

    // Remove all classes
    button.classList.remove("generate-button-error");

    // add loading class to button
    button.classList.add("generate-button-loading");
};

const setButtonError = (err) => {
    const button = document.getElementById("generate-button");
    console.log(err);
    button.innerHTML = err;

    // Remove all classes
    button.classList.remove("generate-button-loading");

    // Add error class to button
    button.classList.add("generate-button-error");
};

const setButtonLoaded = () => {
    const button = document.getElementById("generate-button");

    // Remove all classes
    button.classList.remove("generate-button-loading");
    button.classList.remove("generate-button-error");

    // Add image inside button
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("images/logo-popup.png");
    button.innerHTML = "";
    button.appendChild(img);
};

const handlePromptBoxClick = (e) => {
    console.log(e)
    // DIT WERKT NIET....
    if (e.target.classList.contains("emoji-button")){
        // toggle the clicked class on the button
        target.classList.toggle('clicked');
        console.log(`Button Clicked, state was ${target.classList}"`)
        return;
    }

    // DIT OOK NIET....
    if (e.target.classList.contains("write-button"))
    document.getElementById("write-button").addEventListener("click", () => {
        // Call extract function
        const text = extractText();
        LAST_ACTIVE_EL.focus();
        // TODO Need to make a new animation for this
        setButtonLoading();
        // This sends the text to the OpenAI
        chrome.runtime.sendMessage({ text });
    });
}

const handleClick = (e) => {
    // WHY DOES THIS LOG THE PARENT TABLE INSTEAD OF THE BUTTON ITSELF????
    console.log(e.target)
    // If element is any element within the promptbox, do nothing
    if (e.target.closest('#promptbox') != null) {
        console.log(`Somewhere within promptbox clicked`)
        handlePromptBoxClick(e)
        return;
    }

    // If element is in editable parent, create a new promptbox
    const editableDivs = getAllEditable();
    for (const div of editableDivs) {
        if (div.contains(e.target)) {
            // deletes all other prompt boxes
            deleteButton();
            LAST_ACTIVE_EL = div;
            // creates a new prompt box
            createPromptBox();
            break;
        }
    }
};

// Add event listeners
document.body.addEventListener("click", handleClick);
document.body.addEventListener("resize", deleteButton);
document.body.addEventListener("scroll", deleteButton);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
    if (request.generate) {
        if (request.generate.error) {
            setButtonError(request.generate.error.message);
        } else if (request.generate.text) {
            insertText(request.generate.text);
            setButtonLoaded();
        }
    }
});
