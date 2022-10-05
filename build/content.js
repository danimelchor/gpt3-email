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

    var prev_txt = LAST_ACTIVE_EL.innerHTML;
    var spl_prev_txt = prev_txt.split(SEP);

    const before = spl_prev_txt[0];
    const after = spl_prev_txt[1] || "";

    LAST_ACTIVE_EL.innerHTML = before + res + after;
};

const createButton = async () => {
    // Create button
    const button = document.createElement("button");
    button.style.top = LAST_ACTIVE_EL.offsetHeight + "px";
    button.style.left = "10px";
    button.style.zIndex = 1000;
    button.id = "generate-button";

    // Add image inside button
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("images/logo.png");
    img.style.pointerEvents = "none";
    button.appendChild(img);

    // Add onclick event
    button.addEventListener("click", () => {
        const text = extractText();
        LAST_ACTIVE_EL.focus();
        setButtonLoading();
        chrome.runtime.sendMessage({ text });
    });

    // Append button to parent of input
    LAST_ACTIVE_EL.parentNode.appendChild(button);
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
    button.innerHTML = "Loading...";
    button.style.padding = "5px 10px";
};

const setButtonLoaded = () => {
    const button = document.getElementById("generate-button");
    const img = document.createElement("img");
    button.innerHTML = "";
    button.style.padding = "5px";
    img.src = chrome.runtime.getURL("images/logo.png");
    img.style.pointerEvents = "none";
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
            createButton();
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
        setButtonLoaded();
        insertText(request.generate);
    }
});
