import React from 'react';
import { BookOpen, Code, Database, Cpu, FileText, MessageSquare, Play } from 'lucide-react';

const CDACPrep = () => {
  const subjects = [
    {
      name: 'Aptitude',
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      topics: ['Quantitative', 'Logical Reasoning'],
    },
    {
      name: 'C Programming',
      icon: <Code className="w-8 h-8 text-green-500" />,
      topics: ['Basics', 'Pointers', 'Memory', 'Functions'],
    },
    {
      name: 'Data Structures',
      icon: <Database className="w-8 h-8 text-purple-500" />,
      topics: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees'],
    },
    {
      name: 'Operating System',
      icon: <Cpu className="w-8 h-8 text-red-500" />,
      topics: ['Scheduling', 'Deadlocks', 'Memory Management'],
    },
    {
      name: 'DBMS',
      icon: <Database className="w-8 h-8 text-orange-500" />,
      topics: ['SQL', 'Normalization', 'Transactions'],
    },
    {
      name: 'English',
      icon: <MessageSquare className="w-8 h-8 text-pink-500" />,
      topics: ['Grammar', 'Vocabulary', 'Comprehension'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 CDAC C-CAT 2026 Preparation
          </h1>
          <p className="text-lg text-gray-600">
            Master the syllabus with structured learning and practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex items-center mb-4">
                {subject.icon}
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  {subject.name}
                </h2>
              </div>

              <ul className="mb-6 space-y-2">
                {subject.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {topic}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CDACPrep;