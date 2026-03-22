import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaLinkedin } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: 'Vehicle Management System',
      description: 'Designed and developed a Vehicle Management System using React for the frontend and Spring Boot for core backend services, while integrating MS.NET Web API for centralized logging, with MySQL and MongoDB for data management. The system enables vendors to manage vehicles, customers to browse/book rentals, and admins to control operations. Implemented JWT authentication and Razorpay payment gateway.',
      techStack: ['J2EE', 'Spring Boot', 'React', 'MS.NET', 'MySQL', 'MongoDB', 'Git'],
      github: 'https://github.com/AS-AS-Cube/vms-project',
      linkedin: 'https://linkedin.com/in/siddhesh-g-4823a222a',
      icon: '🚗'
    },
    {
      title: 'Ear Biometric-Based Human Identification',
      description: 'The Ear Biometric Based Human Identification and Authentication System captures an ear image, performs preprocessing, and extracts features using OpenCV and a CNN-based deep learning model. Includes a frontend for image upload and a Python/Flask backend for model inference.',
      techStack: ['Python', 'Flask', 'OpenCV', 'CNN', 'Deep Learning'],
      github: '#',
      linkedin: 'https://linkedin.com/in/siddhesh-g-4823a222a',
      icon: '👂'
    },
    {
      title: 'Personal Portfolio',
      description: 'A modern, responsive personal portfolio website built to showcase projects, skills, and experience with dark mode support.',
      techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
      github: '#',
      linkedin: 'https://linkedin.com/in/siddhesh-g-4823a222a',
      icon: '👨‍💻'
    }
  ];

  return (
    <section id="projects" className="section-padding bg-gray-50/50 dark:bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-indigo-500/10 to-primary/10 dark:from-indigo-600/20 dark:to-primary/20 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                {project.icon}
              </div>
              <div className="p-8 flex-col flex flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {project.techStack.map(tech => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary border border-blue-100 dark:border-blue-800/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  {project.github && project.github !== '#' && (
                    <a
                      href={project.github}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub size={20} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.linkedin && project.linkedin !== '#' && (
                    <a
                      href={project.linkedin}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
