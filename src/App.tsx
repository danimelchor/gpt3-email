import Input from "components/Input";
import Select from "components/Select";
import { useEffect } from "react";
import { useState } from "react";
import "styles/main.css";

import Slider from "./components/Slider";

type ConfigState = {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
};

function App() {
    const [models, setModels] = useState<string[]>(["text-davinci-002"]);
    const [config, setConfig] = useState<ConfigState>({
        apiKey: "",
        model: "text-davinci-002",
        temperature: 0.7,
        maxTokens: 256,
        topP: 1,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
    });

    const updateConfig = (key: keyof ConfigState, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));

        // @ts-ignore
        chrome.storage.sync.set({ [key]: value });
    };

    useEffect(() => {
        fetch("https://api.openai.com/v1/models", {
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                const data = res.data || ["text-davinci-002"];
                setModels(data.map((a: any) => a.id));
            });
    }, [config.apiKey]);

    useEffect(() => {
        // @ts-ignore
        chrome.storage.sync.get(
            [
                "apiKey",
                "model",
                "temperature",
                "maxTokens",
                "topP",
                "frequencyPenalty",
                "presencePenalty",
            ],
            (res: ConfigState) => {
                setConfig({
                    apiKey: res.apiKey || "",
                    model: res.model || "text-davinci-002",
                    temperature: res.temperature || 0.7,
                    maxTokens: res.maxTokens || 256,
                    topP: res.topP || 1,
                    frequencyPenalty: res.frequencyPenalty || 0.0,
                    presencePenalty: res.presencePenalty || 0.0,
                });
            }
        );
    }, []);

    return (
        <div id="main">
            <h1>GPT3-Email Config</h1>
            <Input
                text="API Key"
                onChange={(n) => updateConfig("apiKey", n)}
                value={config.apiKey}
            />
            <Select
                text="Model"
                onChange={(n) => updateConfig("model", n)}
                value={config.model}
                options={models}
            />
            <Slider
                text="Temperature"
                onChange={(n) => updateConfig("temperature", n)}
                min={0}
                max={1}
                value={config.temperature}
                step={0.01}
            />
            <Slider
                text="Top P"
                onChange={(n) => updateConfig("topP", n)}
                min={0}
                max={1}
                value={config.topP}
                step={0.01}
            />
            <Slider
                text="Max tokens"
                onChange={(n) => updateConfig("maxTokens", n)}
                min={1}
                max={4000}
                value={config.maxTokens}
            />
            <Slider
                text="Frequency penalty"
                onChange={(n) => updateConfig("frequencyPenalty", n)}
                min={0}
                max={2}
                value={config.frequencyPenalty}
                step={0.01}
            />
            <Slider
                text="Presence penalty"
                onChange={(n) => updateConfig("presencePenalty", n)}
                min={0}
                max={2}
                value={config.presencePenalty}
                step={0.01}
            />
        </div>
    );
}

export default App;
