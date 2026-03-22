import React from 'react';
import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaAngular, FaBootstrap, FaPython, FaDocker, FaBug, FaBrain, FaDatabase } from 'react-icons/fa';
import { SiSpringboot, SiMysql, SiJira, SiCplusplus, SiSpring, SiMongodb, SiPostman, SiSwagger, SiGithubactions } from 'react-icons/si';
import { VscGitMerge } from 'react-icons/vsc';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', icon: <FaReact className="text-[#61DAFB]" /> },
        { name: 'Angular', icon: <FaAngular className="text-[#DD0031]" /> },
        { name: 'JavaScript', icon: <FaJs className="text-[#F7DF1E]" /> },
        { name: 'HTML5', icon: <FaHtml5 className="text-[#E34F26]" /> },
        { name: 'CSS3', icon: <FaCss3Alt className="text-[#1572B6]" /> },
        { name: 'Bootstrap', icon: <FaBootstrap className="text-[#7952B3]" /> },
      ]
    },
    {
      title: 'Backend & Core',
      skills: [
        { name: 'Java', icon: <FaJava className="text-[#007396]" /> },
        { name: 'Spring Boot', icon: <SiSpringboot className="text-[#6DB33F]" /> },
        { name: 'Spring MVC', icon: <SiSpring className="text-[#6DB33F]" /> },
        { name: 'Python', icon: <FaPython className="text-[#3776AB]" /> },
        { name: 'C++', icon: <SiCplusplus className="text-[#00599C]" /> },
        { name: 'C#', icon: <div className="text-[#239120] font-bold text-xs border-2 border-[#239120] rounded px-1">C#</div> },
        { name: '.NET', icon: <div className="text-[#512BD4] font-bold text-xs border-2 border-[#512BD4] rounded px-1">.NET</div> },
      ]
    },
    {
      title: 'Database & Testing',
      skills: [
        { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" /> },
        { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" /> },
        { name: 'Auto Testing', icon: <FaBug className="text-orange-500" /> },
        { name: 'Manual Testing', icon: <FaDatabase className="text-slate-500" /> },
      ]
    },
    {
      title: 'Tools & AI',
      skills: [
        { name: 'Git', icon: <VscGitMerge className="text-[#F05032]" /> },
        { name: 'Docker', icon: <FaDocker className="text-[#2496ED]" /> },
        { name: 'Jira', icon: <SiJira className="text-[#0052CC]" /> },
        { name: 'Postman', icon: <SiPostman className="text-[#FF6C37]" /> },
        { name: 'Swagger', icon: <SiSwagger className="text-[#85EA2D]" /> },
        { name: 'Maven', icon: <span className="font-bold text-[#C71A36] text-sm">M</span> },
        { name: 'CI/CD', icon: <SiGithubactions className="text-[#2088FF]" /> },
        { name: 'GitHub Actions', icon: <SiGithubactions className="text-[#2088FF]" /> },
        { name: 'AI Modules', icon: <FaBrain className="text-pink-500" /> },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Technical Skills</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map(skill => (
                  <div key={skill.name} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors">{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
