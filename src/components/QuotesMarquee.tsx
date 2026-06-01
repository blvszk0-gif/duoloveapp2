import { motion } from 'framer-motion';
import { SUCCESS_QUOTES } from '../utils/quotes';

export default function QuotesMarquee() {
  // Duplicate quotes to ensure seamless loop
  const duplicatedQuotes = [...SUCCESS_QUOTES, ...SUCCESS_QUOTES];

  return (
    <div className="h-full w-full overflow-hidden relative bg-card/50 rounded-3xl border border-gray-800/50 p-4">
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background/80 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent z-10" />

      <motion.div
        animate={{
          y: [0, -1000], // Approximation, will adjust if needed or use dynamic height
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6 py-8"
      >
        {duplicatedQuotes.map((quote, i) => (
          <div
            key={i}
            className="text-gray-400 text-sm italic font-medium text-center px-4 leading-relaxed"
          >
            "{quote}"
          </div>
        ))}
      </motion.div>
    </div>
  );
}
