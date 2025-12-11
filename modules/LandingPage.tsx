import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { AppMode } from '../types';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  GraduationCap, 
  BrainCircuit, 
  Users, 
  Zap, 
  ShieldCheck, 
  Briefcase,
  Menu,
  X,
  XCircle,
  CheckCircle,
  Play
} from 'lucide-react';

// --- Assets (Stock Videos with Fallback Posters) ---
// Using Pexels videos which are free for commercial use.
const VIDEOS = [
  {
    id: 1,
    url: "https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4",
    poster: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    title: "1. AI Report Analysis",
    desc: "Don't read 50-page reports manually. Our AI scans documents to extract objectives, tech stacks, and risk factors instantly."
  },
  {
    id: 2,
    url: "https://videos.pexels.com/video-files/3252908/3252908-sd_640_360_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    title: "2. Contextual Memory Recall",
    desc: "The system remembers previous meetings. It compares current progress against past promises to flag missed deadlines automatically."
  },
  {
    id: 3,
    url: "https://videos.pexels.com/video-files/3130284/3130284-sd_640_360_30fps.mp4", 
    poster: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    title: "3. Instant Feedback Engine",
    desc: "Generate constructive, academic-grade feedback for students in seconds. Improve project quality without the administrative burnout."
  },
  {
    id: 4,
    url: "https://videos.pexels.com/video-files/5473806/5473806-sd_640_360_25fps.mp4", 
    poster: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    title: "4. Semantic Project Search",
    desc: "Stop using keywords. Ask questions like 'Show me all AI projects using Python in the last year' and get instant results."
  },
  {
    id: 5,
    url: "https://videos.pexels.com/video-files/4443656/4443656-sd_640_360_25fps.mp4", 
    poster: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    title: "5. AI Visual Studio",
    desc: "Enhance project documentation. Edit diagrams, remove backgrounds, or generate new visual assets using simple text prompts."
  }
];

const HERO_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4"; // Abstract Tech Loop

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { setAppMode } = useSimulation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    onGetStarted();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ProjectRadar</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('comparison')} className="hover:text-indigo-600 transition-colors">Why Us?</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-indigo-600 transition-colors">Demo</button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-3">
            <Button onClick={() => handleModeSelect('EDUCATION')} variant="outline" className="text-xs px-4 py-2 h-auto rounded-full border-slate-300">
              Education
            </Button>
            <Button onClick={() => handleModeSelect('ORGANIZATION')} variant="primary" className="text-xs px-4 py-2 h-auto rounded-full shadow-lg shadow-indigo-200">
              Organization
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 p-4 shadow-xl flex flex-col gap-4 z-40"
          >
            <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-600 hover:text-indigo-600 py-2">Features</button>
            <button onClick={() => scrollToSection('comparison')} className="text-left font-medium text-slate-600 hover:text-indigo-600 py-2">Why Us?</button>
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-100">
               <Button onClick={() => handleModeSelect('EDUCATION')} variant="outline" className="w-full justify-center">
                Education Mode
              </Button>
              <Button onClick={() => handleModeSelect('ORGANIZATION')} variant="primary" className="w-full justify-center">
                Organization Mode
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-pulse"></div>
            <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-teal-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>ProjectRadar Intelligence System 2.0</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]"
              >
                Turn Project Chaos into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-400">
                  Intelligence.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed"
              >
                The first AI-powered platform for Universities and Enterprises to track progress, recall context, and generate actionable feedback instantly.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <button 
                  onClick={() => handleModeSelect('EDUCATION')}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-indigo-200/50"
                >
                  <GraduationCap size={20} />
                  Education
                </button>
                <button 
                  onClick={() => handleModeSelect('ORGANIZATION')}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:scale-105 shadow-sm"
                >
                  <Briefcase size={20} />
                  Enterprise
                </button>
              </motion.div>
            </div>

            {/* Right Visual (Video) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2 hidden lg:block"
            >
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video transform rotate-1 hover:rotate-0 transition-transform duration-500">
                 <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-80"
                 >
                    <source src={HERO_VIDEO} type="video/mp4" />
                 </video>
                 {/* Overlay Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent mix-blend-overlay"></div>
               </div>

               {/* Floating Card Animation - Positioned over video */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 1 }}
                 className="absolute -bottom-6 -left-6 w-64 p-4 bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl z-10"
               >
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Users size={16} /></div>
                   <div className="text-xs font-bold text-slate-700">Team Alpha Report</div>
                 </div>
                 <div className="h-2 bg-slate-200 rounded-full w-full mb-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="h-full bg-green-500"
                    ></motion.div>
                 </div>
                 <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>AI Status</span>
                    <span className="font-bold text-green-600">On Track</span>
                 </div>
               </motion.div>

               {/* Second Floating Card - Top Right */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 1.5 }}
                 className="absolute -top-6 -right-4 bg-white p-3 rounded-xl shadow-lg flex items-center gap-2 z-10"
               >
                  <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Deadline Met</div>
                    <div className="text-[10px] text-slate-500">Just now</div>
                  </div>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section: The Old Way vs The New Way */}
      <section id="comparison" className="py-24 bg-white border-y border-slate-100 scroll-mt-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Radar is Superior</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Stop managing projects with scattered emails and forgotten spreadsheets.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
               {/* The Old Way */}
               <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <XCircle size={120} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="p-2 bg-red-100 text-red-600 rounded-lg"><XCircle size={20} /></span>
                    The Old Way
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Endless email threads with attachments",
                      "Manually reading 100+ pages of documentation",
                      "Forgetting what the team promised last month",
                      "Generic 'Good job' feedback due to lack of time",
                      "Disconnected spreadsheets and tools"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-500">
                        <XCircle size={18} className="text-red-400 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
               </motion.div>

               {/* The ProjectRadar Way */}
               <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-8 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
               >
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <CheckCircle size={120} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="p-2 bg-white/20 text-white rounded-lg"><Zap size={20} fill="currentColor" /></span>
                    The ProjectRadar Way
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Centralized Hub for all submissions",
                      "AI Summary: Get key insights in 30 seconds",
                      "Auto-Recall: AI flags missed deadlines vs last month",
                      "Smart Feedback: Detailed, actionable points instantly",
                      "Visual Studio: Edit diagrams with AI text prompts"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-indigo-100">
                        <CheckCircle size={18} className="text-teal-400 mt-1 flex-shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Video Scrollytelling Section */}
      <section id="demo" className="bg-slate-950 text-white py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
           <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase">See it in action</span>
           <h2 className="text-3xl md:text-5xl font-bold mt-2">Intelligence in Motion</h2>
        </div>
        
        <VideoScrollSection />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Powerful Modules</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Everything you need to manage academic or corporate projects effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="text-indigo-600" size={32} />}
              title="AI Report Analyzer"
              description="Upload PDFs or images. Our AI extracts objectives, tech stacks, and risk factors instantly."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Users className="text-teal-600" size={32} />}
              title="Memory Recall"
              description="The system remembers. It compares current reports with previous months to verify progress claims."
              delay={0.2}
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-orange-600" size={32} />}
              title="Smart Feedback"
              description="Automated constructive feedback generation helps mentors provide better guidance in less time."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-indigo-600" size={24} fill="currentColor" />
              <span className="font-bold text-slate-900 text-lg">ProjectRadar</span>
            </div>
            <p className="text-sm">Empowering Educational & Organizational Excellence with AI.</p>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components ---

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
  >
    <div className="mb-4 transform group-hover:scale-110 transition-transform origin-left bg-slate-50 w-fit p-3 rounded-xl">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

// --- Video Scrollytelling Logic ---

const VideoScrollSection = () => {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
      {/* Sticky Video Container */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] sticky top-24 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
        <div className="relative w-full h-full">
            {VIDEOS.map((video, index) => (
                <motion.div
                    key={video.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeVideo === index ? 1 : 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full bg-black"
                >
                    <video 
                        src={video.url}
                        poster={video.poster}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Dark gradient overlay for text readability if text were on top, but here it adds depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold mb-2">
                             <Play size={10} fill="currentColor" /> Live Preview
                        </div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">{video.title}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Scrolling Text Content */}
      <div className="w-full md:w-1/2 flex flex-col gap-[60vh] pb-[40vh] pt-[20vh]">
        {VIDEOS.map((video, index) => (
            <VideoTextSection 
                key={video.id} 
                index={index} 
                title={video.title} 
                desc={video.desc} 
                isActive={activeVideo === index}
                setActive={setActiveVideo} 
            />
        ))}
      </div>
    </div>
  );
};

const VideoTextSection = ({ index, title, desc, isActive, setActive }: { index: number, title: string, desc: string, isActive: boolean, setActive: (n: number) => void }) => {
    const ref = useRef(null);
    // Use a tighter margin to switch more responsively in the center of the screen
    const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

    useEffect(() => {
        if (isInView) {
            setActive(index);
        }
    }, [isInView, index, setActive]);

    return (
        <div ref={ref} className="min-h-[30vh] flex flex-col justify-center p-6 transition-all duration-500">
             <div className={`p-8 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-900/20 translate-x-2' : 'bg-transparent border-slate-800 opacity-40 hover:opacity-60'}`}>
                <h3 className={`text-3xl font-bold mb-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {title}
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                    {desc}
                </p>
                {isActive && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="h-1 bg-indigo-600 mt-6 rounded-full"
                    />
                )}
             </div>
        </div>
    );
};
