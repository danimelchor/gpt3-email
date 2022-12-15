var LAST_ACTIVE_EL = null;
const SEP = "[insert]";

const extractText = () => {
    var txt = LAST_ACTIVE_EL.innerText;
    txt = txt.replace(/(\s)+/g, "$1");
    txt = txt.trim();
    txt = txt.split(SEP);
    return [txt[0], txt[1] || ""];
};

const insertText = (text) => {
    // Insert text as HTML
    const spl_text = text.split("\n");
    var res = "";

    for (const s of spl_text) {
        if (s == "") {
            res += "<div><br></div>";
        } else {
            res += "<div>" + s + "</div>";
        }
    }

    // Split text by separator
    var prev_txt = LAST_ACTIVE_EL.innerHTML;
    var spl_prev_txt = prev_txt.split(SEP);

    // Insert text
    const before = spl_prev_txt[0];
    const after = spl_prev_txt[1] || "";
    LAST_ACTIVE_EL.innerHTML = before + res + after;
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
    div.id = "generate-div";
    div.classList.add("generate-div");

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


    // Add onclick event
    button1.addEventListener("click", () => {
        const text = extractText();
        LAST_ACTIVE_EL.focus();
        setButtonLoading();
        chrome.runtime.sendMessage({ text });
    });

    // Append button to parent of input
    LAST_ACTIVE_EL.parentNode.appendChild(div);
};

const deleteButton = () => {
    const button = document.getElementById("generate-button");
    if (button != null) button.remove();
};

const getAllEditable = () => {
    return document.querySelectorAll("div[contenteditable=true]");
};

const setButtonLoading = () => {
    const button = document.getElementById("generate-button");
    button.innerHTML = "<div class='spinner'></div>";

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
    if (e.target.id == "generate-button") {
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
