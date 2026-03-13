import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmotionIntroPage() {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/emotion/release?type=voice');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 text-amber-900 relative overflow-hidden flex flex-col items-center justify-center px-6"
    >
      <div className="text-center max-w-md">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-light mb-4"
        >
          😔 坏情绪憋太久，会累垮自己
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-amber-800 mb-8"
        >
          不用硬扛，也不用假装没事
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white/30 border border-white/50 rounded-2xl p-6 backdrop-blur-sm shadow-lg mb-10"
        >
          <p className="text-amber-900 mb-2 font-light">这里没有评判，没有说教，只有专属你的情绪</p>
          <p className="text-orange-800 text-sm">- 语音倾诉：说完就销毁，绝对不留痕迹</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={handleProceed}
          className="w-full max-w-xs py-4 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-xl font-medium text-white transition-all active:scale-[0.98] shadow-lg shadow-orange-500/30"
        >
          我准备好了
        </motion.button>
      </div>
    </motion.div>
  );
}
