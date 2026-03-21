import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-40 h-40 bg-primary-100 rounded-full blur-3xl"
        />

        {/* Logo Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="bg-primary-600 p-5 rounded-3xl shadow-glow relative z-10">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          
          {/* Pulsing ring around icon */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 border-2 border-primary-400 rounded-3xl"
          />
        </motion.div>

        {/* Logo Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Edu<span className="text-primary-600">Guide</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1 tracking-widest uppercase">
            Loading Excellence
          </p>
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="mt-10 w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full shadow-glow"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
