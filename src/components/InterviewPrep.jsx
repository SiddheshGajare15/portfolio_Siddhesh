import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaTimes, FaExternalLinkAlt, FaInfoCircle, FaRobot, FaSyncAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { getGeminiModel, isApiKeySet } from '../aiService';

const InterviewPrep = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const model = getGeminiModel("You are a technical interview coach. Provide clean, optimized Java solutions with clear logic explanations. Use Markdown for formatting.");

  const getAISolution = async (question) => {
    setLoading(true);
    setAiResponse('');

    if (!isApiKeySet()) {
       setTimeout(() => {
         setAiResponse(`### 🚀 AI Solution (Demo Mode)
To see a live, complete Java solution and complexity analysis for the **${question.title}** problem, please add your **Gemini API Key** to the .env file! 
         
In a real scenario, I will:
- Write optimized Java code.
- Explain the Time & Space complexity.
- Provide edge case considerations.`);
         setLoading(false);
       }, 1000);
       return;
    }

    try {
      const prompt = `Solve this interview question:
      Title: ${question.title}
      Statement: ${question.statement}
      Rules: ${question.rules.join(', ')}
      
      Provide:
      1. Java Solution
      2. Step by step logic
      3. Time & Space Complexity analysis`;

      const result = await model.generateContent(prompt);
      setAiResponse(result.response.text());
    } catch (error) {
      console.error(error);
      setAiResponse("Failed to generate AI solution. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const questions = {
    shift1: [
      {
        id: 1,
        title: "Discount Calculator",
        difficulty: "Easy",
        difficultyColor: "bg-green-500",
        shortDesc: "Implement a tiered discount system for purchase amounts.",
        statement: "The task is to calculate the final payable amount for a customer based on their purchase amount and a tiered discount system.",
        rules: [
          "If amount < 1000 → 5% discount",
          "If amount ≥ 1000 and < 5000 → 10% discount",
          "If amount ≥ 5000 → 15% discount"
        ],
        inputFormat: "A single integer representing the purchase amount.",
        outputFormat: "A float value representing the final payable amount after discount (formatted to 2 decimal places).",
        sampleInput: "1500",
        sampleOutput: "1350.00",
        explanation: "Since the amount 1500 is between 1000 and 5000, a 10% discount is applied. 10% of 1500 is 150. Final amount = 1500 - 150 = 1350.00."
      },
      {
        id: 2,
        title: "Valid Soldier Arrangement",
        difficulty: "Medium",
        difficultyColor: "bg-orange-500",
        shortDesc: "Count unique ways to arrange soldiers with specific constraints.",
        statement: "Given N positions for soldiers and a set of allowed values for each position. You need to count the total number of ways to arrange soldiers such that certain conditions are met.",
        rules: [
          "Number of soldiers: N",
          "Allowed numbers for each position are given in values[]",
          "The first soldier must have the value 1",
          "The last soldier must have a value equal to a given 'end' value",
          "No two adjacent soldiers can have the same value"
        ],
        inputFormat: "First line: N (number of soldiers), Second line: end (target value for last soldier), Third line: values array.",
        outputFormat: "An integer representing the total count of valid arrangements.",
        sampleInput: "N=3, end=2, values=[1, 2, 3]",
        sampleOutput: "2",
        explanation: "Possible valid arrangements are [1, 3, 2] and [1, 2, 2] is invalid. Only [1, 3, 2] is fully valid across all positions given unique adjacent constraints."
      }
    ],
    shift2: [
      {
        id: 3,
        title: "Parking Charges Calculation",
        difficulty: "Easy",
        difficultyColor: "bg-green-500",
        shortDesc: "Calculate hourly parking rates based on duration tiers.",
        statement: "A parking lot charges based on the duration of parking. Calculate the total cost for a vehicle parked for a given number of hours.",
        rules: [
          "First 2 hours → 100 Rs/hour",
          "Next 3 hours (hours 3 to 5) → 50 Rs/hour",
          "Beyond 5 hours → 20 Rs/hour"
        ],
        inputFormat: "A single integer representing the number of hours.",
        outputFormat: "A single integer representing the total parking cost.",
        sampleInput: "6",
        sampleOutput: "370",
        explanation: "First 2 hours: 2 * 100 = 200. Next 3 hours: 3 * 50 = 150. Remaining 1 hour: 1 * 20 = 20. Total = 200 + 150 + 20 = 370."
      },
      {
        id: 4,
        title: "Balloon Capacity Problem",
        difficulty: "Medium",
        difficultyColor: "bg-orange-500",
        shortDesc: "Maximize number of people in a balloon given weight limits.",
        statement: "Given the weights of several people and a balloon with a maximum weight capacity Y, find the maximum number of people that can fit in the balloon such that their total weight does not exceed Y.",
        rules: [
          "Input: Array of people's weights",
          "Input: Balloon capacity Y",
          "Objective: Maximize the number of people"
        ],
        inputFormat: "First line: List of weights (comma-separated). Second line: An integer Y (max capacity).",
        outputFormat: "An integer representing the maximum number of people.",
        sampleInput: "Weights = [10, 20, 30, 40, 50], Y = 60",
        sampleOutput: "3",
        explanation: "Picking the smallest weights first: 10 + 20 + 30 = 60. This uses 3 people. Any other combination with more people would exceed 60."
      }
    ]
  };

  const QuestionCard = ({ question, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 p-8 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{question.title}</h3>
        <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${question.difficultyColor}`}>
          {question.difficulty}
        </span>
      </div>
      <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 flex-grow">{question.shortDesc}</p>
      <button
        onClick={() => setSelectedQuestion(question)}
        className="w-full py-3 px-6 rounded-xl bg-gray-50 dark:bg-slate-800 text-primary dark:text-blue-400 font-bold text-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 border border-primary/10 flex items-center justify-center gap-2 group"
      >
        View Details <FaExternalLinkAlt size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </motion.div>
  );

  return (
    <section id="interview-prep" className="py-24 bg-[#f8fafc] dark:bg-slate-900/40 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            🔥 Interview Preparation – <span className="text-primary italic font-semibold">Coding Questions</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic mb-8">
            "Real coding questions from top companies like TCS, curated to help you prepare for technical interviews."
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Professional Transparency Disclaimer */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-3xl mx-auto mb-16 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100/50 dark:border-slate-700/50 flex items-center gap-4 text-sm text-blue-700 dark:text-blue-300"
        >
          <FaInfoCircle className="flex-shrink-0 text-blue-500" size={18} />
          <p className="font-medium">
            <span className="font-bold">Transparency Note:</span> Questions are based on candidate experiences shared online. These are for preparation purposes only to help you understand the latest exam patterns.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="space-y-24">
          <div>
            <div className="flex items-center gap-6 mb-12">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">TCS NQT – 21 March 2026 Batch</h3>
              <div className="h-0.5 flex-grow bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...questions.shift1, ...questions.shift2].map((q, idx) => (
                <QuestionCard key={idx} question={q} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Professional Social Connect Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-10 md:p-16 rounded-[2.5rem] bg-white dark:bg-slate-900 text-center relative overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800"
        >
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] dark:opacity-[0.05]">
            <FaLinkedin size={300} className="rotate-12 translate-x-10 translate-y-[-20px]" />
          </div>
          
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Connect & Get Updates
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Want more real interview insights?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              I regularly share coding questions, prep strategies, and tech tips on my social channels. Let's connect and stay ahead.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://linkedin.com/in/siddhesh-g-4823a222a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-4 px-10 bg-[#0077b5] text-white font-bold rounded-2xl hover:bg-[#005a8d] hover:scale-[1.02] transition-all shadow-lg text-lg"
              >
                <FaLinkedin size={22} />
                LinkedIn
              </a>
              <a 
                href="https://www.instagram.com/siddhesh_gajare_45/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-4 px-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold rounded-2xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg text-lg"
              >
                <FaInstagram size={22} />
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/10"
            >
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 flex justify-between items-center border-b dark:border-slate-800 z-10">
                <div className="flex items-center gap-4">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedQuestion.title}</h3>
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${selectedQuestion.difficultyColor}`}>
                    {selectedQuestion.difficulty}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-slate-400"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Problem Statement</h4>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">{selectedQuestion.statement}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Constraints & Rules</h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-slate-400 text-sm">
                        {selectedQuestion.rules.map((rule, idx) => <li key={idx} className="pl-2">{rule}</li>)}
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Input Format</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-300 italic">{selectedQuestion.inputFormat}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Output Format</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-300 italic">{selectedQuestion.outputFormat}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Sample Input</h4>
                      <code className="block font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 break-all">{selectedQuestion.sampleInput}</code>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Sample Output</h4>
                      <code className="block font-mono text-sm text-green-600 dark:text-green-400 bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 break-all">{selectedQuestion.sampleOutput}</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Logic Explanation</h4>
                  <p className="text-gray-600 dark:text-slate-400 italic text-sm leading-relaxed">{selectedQuestion.explanation}</p>
                </div>

                {/* AI Solution Area */}
                <div className="pt-8 border-t dark:border-slate-800">
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <FaRobot className="animate-pulse" />
                        AI Analysis
                      </h4>
                      {!aiResponse && !loading && (
                        <button 
                          onClick={() => getAISolution(selectedQuestion)}
                          className="text-xs font-bold py-2 px-5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all"
                        >
                          Generate AI Answer
                        </button>
                      )}
                   </div>

                   {loading ? (
                     <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-8 text-center">
                        <FaSyncAlt size={24} className="animate-spin text-primary mx-auto mb-4" />
                        <p className="text-sm text-gray-500 font-medium">AI is thinking about the best solution...</p>
                     </div>
                   ) : aiResponse ? (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-8 border dark:border-slate-800"
                      >
                        <ReactMarkdown 
                           components={{
                               code({node, inline, className, children, ...props}) {
                                   return !inline ? (
                                       <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto my-4 text-xs">
                                           <code className="text-blue-400 font-mono" {...props}>{children}</code>
                                       </pre>
                                   ) : (
                                       <code className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-primary font-bold rounded" {...props}>{children}</code>
                                   )
                               }
                           }}
                        >
                          {aiResponse}
                        </ReactMarkdown>
                     </motion.div>
                   ) : (
                     <p className="text-sm text-gray-400 italic">Need help? Click Generate to get an AI-powered solution.</p>
                   )}
                </div>
              </div>

              <div className="p-6 border-t dark:border-slate-800 flex justify-end">
                <button 
                  onClick={() => { setSelectedQuestion(null); setAiResponse(''); }}
                  className="py-3 px-8 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default InterviewPrep;
