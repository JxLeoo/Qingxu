import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiriWave from '../../components/SiriWave';
import { ArrowLeft, Mic, Square } from 'lucide-react';

export default function EmotionReleasePage() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setShowDone(false);
      setRecordingTime(0); // Reset time

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.error('Recording error:', e);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);

    if (recordingTime >= 2) {
      setShowDone(true);
      setTimeout(() => {
        navigate('/emotion/done');
      }, 3000); // 3 second delay
    } else {
      setRecordingTime(0);
    }
  }, [recordingTime, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col relative overflow-hidden"
    >
      <div className="relative z-20 p-6">
        <button
          onClick={() => navigate('/emotion/intro')}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[280px] h-28 mb-10 flex items-center justify-center">
          {isRecording && <SiriWave analyser={analyserRef.current} />}
        </div>

        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileTap={{ scale: 0.92 }}
          className={`w-28 h-28 rounded-full flex items-center justify-center
                     transition-all duration-300 text-white ${
                       isRecording || showDone
                         ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30'
                         : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/30'
                     }`}
        >
          {showDone ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-3xl"
            >
              ✓
            </motion.span>
          ) : isRecording ? (
            <Square className="w-9 h-9" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </motion.button>

        <div className="mt-8 text-center h-12">
          {showDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 text-[15px] font-light"
            >
              已销毁
            </motion.div>
          ) : isRecording ? (
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-slate-300 text-[14px] font-light"
            >
              录音中... {recordingTime}秒
            </motion.div>
          ) : (
            <p className="text-slate-400 text-center text-[14px] font-light leading-relaxed">
              点击开始，倾诉你的烦恼<br />
              <span className="text-slate-500 text-[12px]">录后即焚，无需担心</span>
            </p>
          )}
          {recordingTime > 0 && !isRecording && !showDone && (
            <div className="mt-4 text-slate-500 text-[13px]">
              录音时间太短，需要至少2秒
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
