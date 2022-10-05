const getConfig = async () => {
    const res = await chrome.storage.sync.get([
        "apiKey",
        "model",
        "temperature",
        "maxTokens",
        "topP",
        "frequencyPenalty",
        "presencePenalty",
    ]);
    return res;
};

const getNextTokens = async (prompt, suffix) => {
    const url = "https://api.openai.com/v1/completions";
    const {
        apiKey,
        model,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
    } = await getConfig();

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
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
    };
    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    });

    const json = await res.json();
    return json.choices[0].text;
};

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.text != null) {
        const [prompt, suffix] = request.text;
        const nextTokens = await getNextTokens(prompt, suffix);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { generate: nextTokens });
        });
    }
});
