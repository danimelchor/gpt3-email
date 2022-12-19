const getConfig = async () => {
    const {
        apiKey,
        model,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
    } = await chrome.storage.sync.get([
        "apiKey",
        "model",
        "temperature",
        "maxTokens",
        "topP",
        "frequencyPenalty",
        "presencePenalty",
    ]);

    return {
        apiKey: apiKey || "",
        model: model || "text-davinci-002",
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 256,
        topP: topP || 1,
        frequencyPenalty: frequencyPenalty || 0,
        presencePenalty: presencePenalty || 0,
    };
};

const getNextTokens = async (prompt, suffix) => {
    const url = "https://api.openai.com/v1/edit";

    // Get config from storage
    const {
        apiKey,
        model,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
    } = await getConfig();

    // Create request body
    const data = {
        prompt: prompt,
        suffix: suffix || null,
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
    };

    // Create headers
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
    };

    // Make request
    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    });

    const json = await res.json();

    if (json.error) {
        return { error: json.error };
    }

    return { text: json.choices[0].text };
};

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.text != null) {
        // Communicate with content script to get the current text
        // I think this is where we can add the variables from the buttons
        const prompt = request.text;
        const suffix = request.suffix;
        const completedText = await getNextTokens(prompt, suffix);

        // Communicate with content script to update the text
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { generate: completedText });
        });
    }
});