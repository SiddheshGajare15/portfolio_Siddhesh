import React from 'react';
import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaDatabase } from 'react-icons/fa';
import { SiSpringboot, SiMysql, SiPostman, SiJira, SiMongodb, SiSwagger, SiGithubactions } from 'react-icons/si';
import { VscGitMerge, VscVscode } from 'react-icons/vsc';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'HTML5', icon: <FaHtml5 className="text-[#E34F26]" /> },
        { name: 'CSS3', icon: <FaCss3Alt className="text-[#1572B6]" /> },
        { name: 'JavaScript', icon: <FaJs className="text-[#F7DF1E]" /> },
        { name: 'React', icon: <FaReact className="text-[#61DAFB]" /> },
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Java', icon: <FaJava className="text-[#007396]" /> },
        { name: 'Spring Boot', icon: <SiSpringboot className="text-[#6DB33F]" /> },
        { name: '.NET', icon: <div className="text-[#512BD4] font-bold text-xs border-2 border-[#512BD4] rounded px-1">.NET</div> },
        { name: 'C#', icon: <div className="text-[#239120] font-bold text-xs border-2 border-[#239120] rounded px-1">C#</div> },
      ]
    },
    {
      title: 'Database & Testing',
      skills: [
        { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" /> },
        { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" /> },
        { name: 'Playwright', icon: <div className="text-[#2EAD33] font-bold text-xs border-2 border-[#2EAD33] rounded px-1">PW</div> },
        { name: 'Manual Testing', icon: <FaDatabase className="text-slate-500" /> },
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'Git', icon: <VscGitMerge className="text-[#F05032]" /> },
        { name: 'Maven', icon: <span className="font-bold text-[#C71A36] text-sm">M</span> },
        { name: 'Postman', icon: <SiPostman className="text-[#FF6C37]" /> },
        { name: 'Jira', icon: <SiJira className="text-[#0052CC]" /> },
        { name: 'Swagger', icon: <SiSwagger className="text-[#85EA2D]" /> },
        { name: 'VS Code', icon: <VscVscode className="text-[#007ACC]" /> },
        { name: 'CI/CD', icon: <SiGithubactions className="text-[#2088FF]" /> },
        { name: 'GitHub Actions', icon: <SiGithubactions className="text-[#2088FF]" /> },
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
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Technical Skills</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full"></div>
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
