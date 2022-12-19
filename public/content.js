// Define a global variable pointing to the active email div
var ACTIVE_EMAIL_DIV = null;

// Takes the text from the gmail box
const extractText = () => {
    // Define a variable to hold the extracted text
    var txt = ACTIVE_EMAIL_DIV.innerText;
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
        if (s === "") {
            // Add a white line if there is no text
            res += "<div><br></div>";
        } else {
            // Add the text if there is text
            res += "<div>" + s + "</div>";
        }
    }

    // Insert text at the beginning or end of the existing text in the Gmail box
    ACTIVE_EMAIL_DIV.innerHTML = txt + res;
};

const createPromptBox = async () => {
    fetch(chrome.runtime.getURL("promptbox.html")).then(res => res.text()).then(promptboxHTML => {
        var promptbox = new DOMParser().parseFromString(promptboxHTML, "text/html").body.childNodes[0]

        // Add image to Write Button
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("images/Wonka-Logo-48x48.png")
        promptbox.getElementsByClassName("write-button")[0].appendChild(img);

        //add the promptbox
        ACTIVE_EMAIL_DIV.parentNode.prepend(promptbox)

        // Needs to be here to allow box to appear above all other elements
        ACTIVE_EMAIL_DIV.classList.remove("aO9")
    })
};

// Deletes the prompt box
const deleteButton = () => {
    const button = document.getElementById("promptbox");
    if (button != null) button.remove();
};

// Gets all Email Boxes
const getAllEditable = () => {
    return document.querySelectorAll("div[contenteditable=true]");
};

//changed this to button 9 to see if it works on my button
const setWriteButtonLoading = (writeButton) => {
    writeButton.innerHTML = "Loading";

    // Remove all classes
    writeButton.classList.remove("write-button-error");

    // add loading class to button
    writeButton.classList.add("write-button-loading");
};

const setWriteButtonError = () => {
    const button = document.getElementById("write-button");
    button.innerHTML = "Error";

    // Remove all classes
    button.classList.remove("write-button-loading");

    // Add error class to button
    button.classList.add("write-button-error");
};

const setWriteButtonLoaded = () => {
    const button = document.getElementById("write-button");

    // Remove all classes
    button.classList.remove("write-button-loading");
    button.classList.remove("write-button-error");

    button.innerHTML = "WRITE"
};

const handlePromptBoxClick = (e) => {
    if (e.target.classList.contains("emoji-button")) {
        e.target.classList.toggle('clicked');
        return;
    }

    if (e.target.classList.contains("write-button")) {
        // Call extract function
        const text = extractText();
        console.log(text);

        ACTIVE_EMAIL_DIV.focus();
        // TODO Need to make a new animation for this
        setWriteButtonLoading(e.target);
        // This sends the text to the OpenAI
        chrome.runtime.sendMessage({ text });
    }
}

const handleClick = (e) => {
    const editableDivs = getAllEditable();
    for (const div of editableDivs) {
        if (div.parentElement.contains(e.target)) {
            // change to active Email Box
            ACTIVE_EMAIL_DIV = div;

            // If target is inside a promptbox, handle the promptbox click
            if (e.target.closest('#promptbox') != null) {
                handlePromptBoxClick(e)
                return;
            }

            // If element is in editable parent without promptbox, create a new promptbox
            if (div.parentNode.querySelector('#promptbox') == null) {
                createPromptBox();
                return;
            }
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
            setWriteButtonError();
            console.error(request.generate.error.message);
            insertText(request.generate.error.message);
        } else if (request.generate.text) {
            setWriteButtonLoaded();
            console.log(request.generate.text);
            insertText(request.generate.text);
        }
    }
});
