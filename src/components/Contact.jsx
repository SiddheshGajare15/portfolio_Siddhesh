import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 relative z-10 overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <a href="mailto:siddheshgajare62@gmail.com" className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                      siddheshgajare62@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FaPhoneAlt size={20} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Phone</span>
                    <a href="tel:+919921990983" className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                      +91 99219 90983
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FaLinkedin size={20} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">LinkedIn</span>
                    <a href="https://linkedin.com/in/siddhesh-g-4823a222a" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                      linkedin.com/in/siddhesh-g-4823a222a
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FaGithub size={20} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">GitHub</span>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                      github.com/siddheshgajare
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Location</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Pune, Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form 
              action="https://formsubmit.co/siddheshgajare62@gmail.com" 
              method="POST"
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 space-y-6"
            >
              <input type="hidden" name="_captcha" value="false" />
              <div>
                <label className="block text-sm font-medium leading-none mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="flex h-12 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-[border-primary] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium leading-none mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="flex h-12 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-[border-primary] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-none mb-2 text-gray-700 dark:text-gray-300" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Hello Siddhesh, I'd like to talk about..."
                  className="flex min-h-[120px] w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-3 py-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-[border-primary] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
