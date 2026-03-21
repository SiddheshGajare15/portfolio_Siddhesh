import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaBuilding, FaTools, FaServer, FaEnvelope, FaWhatsapp, FaLinkedin, FaGraduationCap } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      title: 'Portfolio Website',
      icon: <FaGlobe className="text-4xl text-blue-500 mb-4" />,
      features: ['Personal portfolio (React / HTML)', 'Responsive design', 'Modern UI'],
      price: 'Starting from ₹499'
    },
    {
      title: 'Business / Landing Website',
      icon: <FaBuilding className="text-4xl text-indigo-500 mb-4" />,
      features: ['Small business websites', 'Landing pages', 'Contact forms'],
      price: 'Starting from ₹999'
    },
    {
      title: 'Engineering Project Development',
      icon: <FaGraduationCap className="text-4xl text-green-500 mb-4" />,
      features: ['College final year projects', 'Mini & major projects', 'Clean UI + basic backend', 'Documentation guidance'],
      price: 'Starting from ₹999'
    },
    {
      title: 'Bug Fixing / UI Improvements',
      icon: <FaTools className="text-4xl text-orange-500 mb-4" />,
      features: ['Fix UI bugs', 'Improve responsiveness', 'Optimize performance'],
      price: 'Starting from ₹299'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50/50 dark:bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">💼 Services I Offer</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I provide affordable and high-quality web solutions for individuals, students, and small businesses. Currently focused on frontend development and small-scale applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col h-full"
            >
              <div className="flex flex-col items-center text-center mb-6">
                {service.icon}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold rounded-lg text-center border border-blue-100 dark:border-blue-800/50">
                {service.price}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlighted Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-slate-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-md border border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-yellow-200 dark:border-yellow-700/50">
            🚧 Coming Soon
          </div>
          <div className="flex items-center gap-4 mb-4">
            <FaServer className="text-3xl text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Fullstack Web Applications Development</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2"><span className="text-gray-400">•</span> REST APIs (Spring Boot)</li>
            <li className="flex items-center gap-2"><span className="text-gray-400">•</span> Database config (MySQL)</li>
            <li className="flex items-center gap-2"><span className="text-gray-400">•</span> Authentication configs</li>
          </ul>
        </motion.div>

        <p className="text-center text-gray-500 dark:text-gray-400 italic text-sm mb-24">
          💡 Pricing is flexible based on project requirements.
        </p>

        {/* Hire Me Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-primary dark:bg-slate-800 rounded-3xl p-10 md:p-14 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 dark:bg-black/20 rounded-full blur-3xl -z-0 transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">🚀 Hire Me</h2>
            <p className="text-blue-100 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              I help individuals and businesses build modern, scalable, and user-friendly web applications.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="mailto:siddheshgajare@gmail.com?subject=Project Inquiry&body=Hello Siddhesh, I want to discuss a project."
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary dark:bg-slate-900 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-slate-950 hover:-translate-y-1 transition-all shadow-lg text-sm sm:text-base"
              >
                <FaEnvelope className="text-lg" />
                Email Me
              </a>
              <a
                href="https://wa.me/919921990983"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#20bd5a] hover:-translate-y-1 transition-all shadow-lg text-sm sm:text-base"
              >
                <FaWhatsapp className="text-lg" />
                WhatsApp Me
              </a>
              <a
                href="https://linkedin.com/in/siddhesh-g-4823a222a"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#0A66C2] text-white rounded-full font-bold hover:bg-[#004182] hover:-translate-y-1 transition-all shadow-lg text-sm sm:text-base"
              >
                <FaLinkedin className="text-lg" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
