import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  Share2, 
  ChevronRight, 
  Layers, 
  Globe, 
  BookMarked,
  FileText,
  Video,
  Twitter,
  Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Mock data for the visual preview section
  const previewCards = [
    { icon: <FileText size={18} />, label: "React Docs", color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: <Video size={18} />, label: "MERN Tutorial", color: "text-red-400", bg: "bg-red-400/10" },
    { icon: <Twitter size={18} />, label: "Tech Thread", color: "text-sky-400", bg: "bg-sky-400/10" },
    { icon: <LinkIcon size={18} />, label: "Portfolio", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#7C3AED]/30 overflow-x-hidden">
      <Navbar />
      
      {/* ── Background Gradients ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#7C3AED] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-[#06B6D4] opacity-5 blur-[100px] rounded-full" />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13131A] border border-[#1F1F2E] text-[#7C3AED] text-sm font-bold shadow-xl"
          >
            <Zap size={14} fill="currentColor" />
            {/* <span>MERN Stack 21-Day Challenge</span> */}
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Build Your Second <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#06B6D4] bg-clip-text text-transparent">
              Digital Brain
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 text-base md:text-xl leading-relaxed"
          >
            BookMaster automatically organizes your articles, tweets, and videos into a 
            semantic knowledge graph. Never lose a valuable insight again.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-bold group bg-[#7C3AED] hover:bg-[#6D28D9]"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
              <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
            onClick={() => navigate('/dashboard')}
             variant="secondary" size="lg" className="px-8 py-4 text-lg border-[#1F1F2E] hover:bg-[#13131A]">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Visual Feature Section (Replaced the Big Image) ── */}
      <section className="px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#13131A]/50 border border-[#1F1F2E] rounded-[40px] p-8 md:p-12 relative overflow-hidden group"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            {/* Left Side: Text */}
            <div className="space-y-4 text-left">
              <div className="w-12 h-12 bg-[#7C3AED] rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-[#7C3AED]/20">
                <BookMarked size={24} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Organize with Intelligence</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
               BookMaster automatically organizes your articles, tweets, and videos into a 
            semantic knowledge graph. Never lose a valuable insight again.
              </p>
            </div>

            {/* Right Side: Interactive Card Grid */}
            <div className="grid grid-cols-2 gap-3 relative">
              {previewCards.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-[#0A0A0F] border border-[#1F1F2E] p-4 rounded-2xl flex flex-col gap-3 shadow-xl"
                >
                  <div className={`w-8 h-8 ${card.bg} ${card.color} rounded-lg flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-300">{card.label}</span>
                  <div className="h-1.5 w-full bg-[#1F1F2E] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features List Section ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-[#13131A] border border-[#1F1F2E] hover:border-[#7C3AED]/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center text-[#7C3AED] mb-6 group-hover:scale-110 transition-transform">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Semantic Search</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Don't just search for keywords. Search for concepts. Our AI understands what you've saved.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-[#13131A] border border-[#1F1F2E] hover:border-[#06B6D4]/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-[#06B6D4]/10 rounded-2xl flex items-center justify-center text-[#06B6D4] mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Auto-Clustering</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Your links are automatically tagged and grouped into smart collections based on their content.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-[#13131A] border border-[#1F1F2E] hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Browser Sync</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Save anything from anywhere with our one-click browser extension. Fast and seamless.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-[#13131A]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold italic">Ready to organize your chaos?</h2>
          <p className="text-gray-500">Join from now to building your knowledge graph today.</p>
          <Button 
            variant="primary" 
            size="lg" 
            className="rounded-2xl px-12 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] transition-all shadow-xl shadow-[#7C3AED]/20"
            onClick={() => navigate('/register')}
          >
            Start for Free
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#1F1F2E] text-center text-gray-600 text-xs">
        <p>© 2026 BookMaster. Built with MERN Stack & Passion.</p>
      </footer>
    </div>
  );
};

export default HomePage;