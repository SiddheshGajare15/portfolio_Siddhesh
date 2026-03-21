import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaLightbulb, FaCopy, FaTrash, FaSyncAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { getGeminiModel, isApiKeySet } from '../aiService';

const AICodeExplainer = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const responseRef = useRef(null);

    // Initialize Gemini AI via central service
    const model = getGeminiModel("You are an expert AI Code Explainer and Interview Assistant. Your goal is to help students understand coding problems, Java snippets, and technical interview queries. Use Markdown formatting for headings and code blocks.");

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('ai_history') || '[]');
        setHistory(savedHistory);
    }, []);

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem('ai_history', JSON.stringify(history));
    }, [history]);

    // Auto-scroll to response
    useEffect(() => {
        if (response && responseRef.current) {
            responseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [response]);

    const handleAction = async (mode) => {
        if (!input.trim()) {
            setError('Please enter some code or a question first.');
            return;
        }

        setLoading(true);
        setError('');
        setResponse('');

        // Provide a Demo Mode walkthrough if the API key is missing
        if (!isApiKeySet()) {
            setTimeout(() => {
                const demoResponse = `### 🌟 Demo Mode Active
It looks like you haven't added your **Gemini API Key** yet. Once you add it, I'll be able to analyze any code you give me!

Here's how this code snippet works:
1. **Public Class**: This is the entry point of your Java program.
2. **Main Method**: This is where the execution starts.
3. **Execution**: It prints "Hello World" to the console.

**To unlock full live AI analysis, please add your VITE_GEMINI_API_KEY to your .env file!**`;
                setResponse(demoResponse);
                setHistory(prev => [{ input: input.substring(0, 50) + '...', response: "Demo Mode Response" }, ...prev].slice(0, 3));
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            let userPrompt = "";

            if (mode === 'explain') {
                userPrompt = `Explain the following code or problem in simple terms. Provide a step-by-step breakdown:\n\n${input}`;
            } else if (mode === 'approach') {
                userPrompt = `Describe the logical approach and algorithm needed to solve this problem. If there is an optimized solution, mention it briefly:\n\n${input}`;
            } else {
                userPrompt = `Help me with the following interview-related query or code analysis:\n\n${input}`;
            }

            const result = await model.generateContent(userPrompt);
            const aiRes = result.response.text();
            
            setResponse(aiRes);
            
            // Add to history (keep only last 3)
            setHistory(prev => [{ input: input.substring(0, 50) + '...', response: aiRes }, ...prev].slice(0, 3));
        } catch (err) {
            console.error(err);
            setError('Failed to connect to AI server. Make sure your API key is valid and you have an internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(response);
        alert('Response copied to clipboard!');
    };

    const tryExample = () => {
        setInput(`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
    };

    return (
        <section id="ai-assistant" className="py-24 bg-white dark:bg-slate-900 overflow-hidden min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        <FaRobot size={16} className="animate-pulse" />
                        AI Powered
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                        🤖 AI Code <span className="text-primary italic">Explainer</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto italic leading-relaxed">
                        "Your intelligent companion for breaking down complex code, logic, and interview challenges instantly."
                    </p>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mt-8"></div>
                </motion.div>

                <div className="grid grid-cols-1 gap-10">
                    {/* Input Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                Input Panel
                            </h3>
                            <button 
                                onClick={tryExample}
                                className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5"
                            >
                                <FaLightbulb size={14} /> Try Example
                            </button>
                        </div>

                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your Java code, coding question, or interview query here..."
                            className="w-full h-64 p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:outline-none dark:text-gray-200 font-mono text-sm leading-relaxed resize-none transition-all"
                        />

                        <div className="flex flex-wrap gap-4 mt-8">
                            <button 
                                onClick={() => handleAction('explain')}
                                disabled={loading}
                                className="flex-grow py-4 px-8 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                            >
                                {loading && <FaSyncAlt className="animate-spin" />}
                                <FaPaperPlane /> Explain Code
                            </button>
                            <button 
                                onClick={() => handleAction('approach')}
                                disabled={loading}
                                className="flex-grow py-4 px-8 border-2 border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 font-bold rounded-2xl hover:bg-primary/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading && <FaSyncAlt className="animate-spin" />}
                                <FaLightbulb /> Get Approach
                            </button>
                            <button 
                                onClick={() => { setInput(''); setResponse(''); }}
                                className="p-4 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30"
                            >
                                {error}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Output Panel */}
                    <AnimatePresence>
                        {(response || loading) && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-primary/10 shadow-2xl relative min-h-[400px]"
                                ref={responseRef}
                            >
                                <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        AI Insights
                                    </h3>
                                    {response && (
                                        <button 
                                            onClick={copyToClipboard}
                                            className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold"
                                        >
                                            <FaCopy /> Copy
                                        </button>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-6 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <FaRobot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={20} />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Analysing your code and preparing the best response...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                                        <ReactMarkdown 
                                            components={{
                                                code({node, inline, className, children, ...props}) {
                                                    return !inline ? (
                                                        <pre className="p-6 bg-slate-900 rounded-2xl overflow-x-auto my-6 shadow-inner border border-white/5">
                                                            <code className="text-blue-400 font-mono text-sm leading-relaxed" {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    ) : (
                                                        <code className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-primary font-bold rounded" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {response}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* History Section */}
                    {history.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="mt-12"
                        >
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-3">
                                <span className="h-px flex-grow bg-gray-200 dark:bg-slate-800"></span>
                                Recent Queries
                                <span className="h-px flex-grow bg-gray-200 dark:bg-slate-800"></span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {history.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => { setInput(item.input); setResponse(item.response); }}
                                        className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 cursor-pointer hover:border-primary/30 transition-all text-xs text-gray-500 dark:text-gray-400 font-mono truncate"
                                    >
                                        {item.input}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AICodeExplainer;
