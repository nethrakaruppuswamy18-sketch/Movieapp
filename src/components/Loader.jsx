import { motion } from "motion/react";
import { Film } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="relative flex items-center justify-center text-red-500"
      >
        <Film className="w-12 h-12 stroke-[1.5]" />
        <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full w-12 h-12 animate-spin-slow"></div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="font-mono text-sm tracking-wider text-gray-400 capitalize"
      >
        Loading cinematic experience...
      </motion.p>
    </div>
  );
}
