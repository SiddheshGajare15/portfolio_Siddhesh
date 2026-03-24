import { useState } from "react";
import { callAiBackend } from "../aiService";

function AITest() {
    const [output, setOutput] = useState("");

    const testAI = async () => {
        try {
            console.log("Calling AI...");
            const res = await callAiBackend("Write hello world in Java", "explain");
            console.log("AI Response:", res);
            setOutput(res);
        } catch (err) {
            console.error("Error:", err);
            setOutput("Error occurred");
        }
    };

    return (
        <div style={{ padding: "40px", color: "white" }}>
            <h1>AI Test</h1>

            {/* ✅ BUTTON */}
            <button
                onClick={testAI}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "20px"
                }}
            >
                Test OpenRouter AI
            </button>

            {/* ✅ OUTPUT */}
            <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
                {output}
            </pre>
        </div>
    );
}

export default AITest;