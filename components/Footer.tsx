'use client'

import { motion } from 'framer-motion'
import { Coffee, Heart, Globe, Mail, Twitter, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                CoffeeOracle
              </h3>
            </motion.div>
            
            <p className="text-slate-100 text-lg leading-relaxed mb-6 max-w-md">
              Discover your future through the ancient art of coffee ground divination. 
              AI-powered prophecies that blend mysticism with modern technology.
            </p>
            
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://coffeeoracle.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-200 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-5 h-5" />
                <span>coffeeoracle.org</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-slate-200">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="#features" 
                  className="text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  Features
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#how-it-works" 
                  className="text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  How It Works
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#about" 
                  className="text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  About
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#contact" 
                  className="text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  Contact
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold mb-6 text-slate-200">Connect</h4>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="mailto:hello@coffeeoracle.org"
                  className="flex items-center space-x-2 text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="w-4 h-4" />
                  <span>hello@coffeeoracle.org</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="https://twitter.com/coffeeoracle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Twitter className="w-4 h-4" />
                  <span>@coffeeoracle</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="https://github.com/coffeeoracle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-slate-200 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </motion.a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-slate-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-300">
              <Heart className="w-4 h-4 text-orange-400" />
              <span>Made with mystical energy</span>
            </div>
            
            <div className="text-slate-300 text-sm">
              © {currentYear} CoffeeOracle. All rights reserved.
            </div>
            

          </div>
        </motion.div>
      </div>
    </footer>
  )
}
