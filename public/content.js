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

const createElement = async () => {
    // Create button wrapper
    const div = document.createElement("div");
    div.style.top = LAST_ACTIVE_EL.offsetHeight + "px";
    div.style.left = "10px";
    div.style.zIndex = 1000;
    div.style.width = "32px";
    div.style.height = "32px";
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.alignItems = 'flex-start';
    div.style.padding = '2px';
    div.style.gap = '4px';
    div.id = "promptbox";
    div.classList.add("promptbox");

    //Add buttons inside div
    const button1 = document.createElement('button');
    button1.innerHTML = '👍';
    button1.classList.add('button');
    button1.classList.add('emoji-button');

    const button2 = document.createElement('button');
    button2.innerHTML = '👎';
    button2.classList.add('button');
    button2.classList.add('emoji-button');

    const divider1 = document.createElement('div');
    divider1.classList.add('divider');

    const button3 = document.createElement('button');
    button3.innerHTML = '🙎‍♂️';
    button3.classList.add('button');
    button3.classList.add('emoji-button');

    const button4 = document.createElement('button');
    button4.innerHTML = '🧑‍💻';
    button4.classList.add('button');
    button4.classList.add('emoji-button');

    const divider2 = document.createElement('div');
    divider2.classList.add('divider');
    

    const button5 = document.createElement('button');
    button5.innerHTML = '🤩';
    button5.classList.add('button');
    button5.classList.add('emoji-button');

    const button6 = document.createElement('button');
    button6.innerHTML = '🙂';
    button6.classList.add('button');
    button6.classList.add('emoji-button');

    const button7 = document.createElement('button');
    button7.innerHTML = '🥺';
    button7.classList.add('button');
    button7.classList.add('emoji-button');

    const button8 = document.createElement('button');
    button8.innerHTML = '🙄';
    button8.classList.add('button');
    button8.classList.add('emoji-button');

    const divider3 = document.createElement('div');
    divider3.classList.add('divider');

    const button9 = document.createElement('button');
    button9.innerHTML = 'WRITE';
    button9.classList.add('button');
    button9.classList.add('write-button');
  
    // Add the buttons to the div
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(divider1);
    div.appendChild(button3);
    div.appendChild(button4);
    div.appendChild(divider2);
    div.appendChild(button5);
    div.appendChild(button6);
    div.appendChild(button7);
    div.appendChild(button8);
    div.appendChild(divider3);
    div.appendChild(button9);

    // get a reference to the buttons
    const buttons = document.querySelectorAll('.div button');

    // add a click event listener to each button
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            // toggle the clicked class on the button
            button.classList.toggle('clicked');
        });
    });


    // Add onclick event for the write button
    button9.addEventListener("click", () => {
        // Call extract function
        const text = extractText();
        LAST_ACTIVE_EL.focus();
        // TODO Need to make a new animation for this
        setButtonLoading();
        // This sends the text to the OpenAI
        chrome.runtime.sendMessage({ text });
    });

    // Append button to parent of input
    LAST_ACTIVE_EL.parentNode.appendChild(div);
};

//Why would you remove the button? Because you will change it with the loading one? 
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

const handleClick = (e) => {
    // If element is GPT-3 button, do nothing
    if (e.target.id == "promptbox") {
        return;
    }

    // If element is in editable parent, create button
    const editableDivs = getAllEditable();
    for (const div of editableDivs) {
        if (div.contains(e.target)) {
            deleteButton();
            LAST_ACTIVE_EL = div;
            createElement();
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
