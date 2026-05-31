import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MatchPairsProps {
  pairs: { id: string; native: string; target: string }[];
  onComplete: () => void;
}

interface Item {
  id: string;
  text: string;
  type: 'native' | 'target';
  originalId: string;
}

export default function MatchPairs({ pairs, onComplete }: MatchPairsProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{ id1: string, id2: string } | null>(null);

  useEffect(() => {
    const nativeItems: Item[] = pairs.map(p => ({ id: `n-${p.id}`, text: p.native, type: 'native', originalId: p.id }));
    const targetItems: Item[] = pairs.map(p => ({ id: `t-${p.id}`, text: p.target, type: 'target', originalId: p.id }));
    setItems([...nativeItems, ...targetItems].sort(() => Math.random() - 0.5));
  }, [pairs]);

  const handleSelect = (item: Item) => {
    if (matched.includes(item.id) || wrong) return;

    if (!selected) {
      setSelected(item);
    } else if (selected.id === item.id) {
      setSelected(null);
    } else {
      // Check for match
      if (selected.originalId === item.originalId && selected.type !== item.type) {
        // Success
        setMatched(prev => [...prev, selected.id, item.id]);
        setSelected(null);
      } else {
        // Failure
        setWrong({ id1: selected.id, id2: item.id });
        setTimeout(() => {
          setWrong(null);
          setSelected(null);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === items.length && items.length > 0) {
      setTimeout(onComplete, 1000);
    }
  }, [matched, items, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Match the pairs</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected = selected?.id === item.id;
          const isMatched = matched.includes(item.id);
          const isWrong = wrong?.id1 === item.id || wrong?.id2 === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleSelect(item)}
              animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              className={`p-4 h-16 rounded-xl border-2 font-medium transition-all ${
                isMatched ? 'bg-success/20 border-success opacity-50' :
                isWrong ? 'bg-red-500/20 border-red-500' :
                isSelected ? 'bg-orchid/20 border-orchid' :
                'bg-card border-gray-700 hover:border-gray-500'
              }`}
            >
              {item.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
