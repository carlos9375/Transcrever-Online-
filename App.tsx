
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import FloatingShapes from './components/FloatingShapes';
import { transcribeWithSynonyms } from './services/geminiService';
import { AppStatus } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTranscribe = async () => {
    if (!inputText.trim()) return;

    setStatus(AppStatus.LOADING);
    setErrorMessage('');
    
    try {
      const result = await transcribeWithSynonyms(inputText);
      setOutputText(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro inesperado.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleCopy = useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }, [outputText]);

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStatus(AppStatus.IDLE);
    setErrorMessage('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-blue-200">
      <FloatingShapes />
      
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <Header />

        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Editor Input */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-2xl font-bold text-sky-900">Entrada</h2>
                <p className="text-sky-600 text-sm">Insira o texto que deseja aprimorar</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="bg-white/50 hover:bg-white px-4 py-2 rounded-xl text-sky-700 text-sm font-medium transition-colors border border-sky-100"
              >
                Resetar
              </motion.button>
            </div>

            <motion.div 
              whileFocus={{ scale: 1.01 }}
              className="relative rounded-[2rem] overflow-hidden glass shadow-2xl transition-all border-white/60"
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva algo brilhante aqui..."
                className="w-full h-[450px] p-8 bg-transparent focus:outline-none text-sky-950 text-lg leading-relaxed placeholder-sky-300 resize-none"
              />
              <div className="absolute bottom-6 left-8 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  {inputText.split(/\s+/).filter(Boolean).length} palavras
                </span>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTranscribe}
              disabled={status === AppStatus.LOADING || !inputText.trim()}
              className={`relative group w-full py-5 rounded-2xl font-black text-xl overflow-hidden transition-all ${
                status === AppStatus.LOADING 
                  ? 'bg-sky-200 cursor-not-allowed text-sky-400' 
                  : 'bg-blue-600 text-white'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {status === AppStatus.LOADING ? (
                  <>
                    <i className="fas fa-compact-disc fa-spin"></i>
                    IA Analisando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles"></i>
                    Transcrever Agora
                  </>
                )}
              </div>
              {status !== AppStatus.LOADING && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.button>
          </div>

          {/* Result Output */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-2xl font-bold text-sky-900">Resultado</h2>
                <p className="text-sky-600 text-sm">Seu texto com vocabulário enriquecido</p>
              </div>
              <AnimatePresence>
                {status === AppStatus.SUCCESS && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-5 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                      copySuccess ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600 border border-blue-100'
                    }`}
                  >
                    <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                    {copySuccess ? 'Copiado' : 'Copiar Texto'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              className={`relative rounded-[2rem] overflow-hidden glass shadow-2xl transition-all border-white/60 ${
                status === AppStatus.LOADING ? 'ring-4 ring-blue-400/20' : ''
              }`}
            >
              {status === AppStatus.LOADING && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/20 backdrop-blur-[2px]">
                   <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                   <p className="font-bold text-blue-600 animate-pulse tracking-widest text-xs uppercase">Processando Linguagem...</p>
                </div>
              )}
              
              <textarea
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="A mágica acontecerá aqui..."
                className="w-full h-[450px] p-8 bg-transparent focus:outline-none text-blue-900 text-lg leading-relaxed placeholder-blue-300 resize-none"
              />

              <div className="absolute bottom-6 right-8">
                <div className="flex gap-2">
                  <div className="h-1.5 w-6 rounded-full bg-blue-100" />
                  <div className="h-1.5 w-3 rounded-full bg-blue-200" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {status === AppStatus.ERROR && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 font-medium"
                >
                  <i className="fas fa-circle-exclamation text-xl"></i>
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 rounded-[2rem] glass border-white/60">
              <div className="flex items-center gap-3 mb-3 text-sky-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="fas fa-lightbulb text-blue-600"></i>
                </div>
                <h3 className="font-bold">Interação Dinâmica</h3>
              </div>
              <p className="text-sky-800/70 text-sm leading-relaxed">
                Este layout foi projetado para ser intuitivo. Sinta-se à vontade para <strong>editar manualmente</strong> o resultado da IA para dar seu toque final antes de copiar.
              </p>
            </div>
          </div>
        </motion.main>

        <footer className="mt-24 pt-12 border-t border-sky-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-sky-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} Transcrever Online. Criado para mentes criativas.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-blue-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a>
            <a href="#" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Feedback
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
