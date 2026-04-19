"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function TranquilityButton() {
  const handlePress = () => {
    console.log("Calm");
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-8">
      <motion.button
        onClick={handlePress}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0px 0px 0px 0px rgba(16, 185, 129, 0.2)",
            "0px 0px 20px 10px rgba(16, 185, 129, 0.1)",
            "0px 0px 0px 0px rgba(16, 185, 129, 0.2)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 shadow-inner group overflow-hidden"
      >
        <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        <Heart 
          size={36} 
          className="text-emerald-500 drop-shadow-sm z-10" 
          strokeWidth={1.5}
        />
      </motion.button>
      <span className="text-sm text-emerald-600/80 font-medium mt-4 tracking-wide uppercase text-xs">
        Tap for Peace
      </span>
    </div>
  );
}
