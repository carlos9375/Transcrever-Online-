
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
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
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <Header />

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Input Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-sky-800 flex items-center gap-2">
              <i className="fas fa-pen-nib text-sky-500"></i> Seu Texto
            </h2>
            <button 
              onClick={handleClear}
              className="text-sm text-sky-600 hover:text-sky-800 transition-colors"
            >
              Limpar Tudo
            </button>
          </div>
          <div className="relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Cole ou digite seu texto aqui..."
              className="w-full h-80 p-6 rounded-3xl glass shadow-xl focus:ring-4 focus:ring-sky-200 focus:outline-none transition-all resize-none text-sky-900 leading-relaxed placeholder-sky-400"
            />
            {inputText && (
              <div className="absolute bottom-4 right-4 text-xs text-sky-400 bg-white/50 px-2 py-1 rounded-md">
                {inputText.length} caracteres
              </div>
            )}
          </div>
          <button
            onClick={handleTranscribe}
            disabled={status === AppStatus.LOADING || !inputText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-3 ${
              status === AppStatus.LOADING 
                ? 'bg-sky-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-blue-200/50'
            }`}
          >
            {status === AppStatus.LOADING ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i> Processando...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i> Enriquecer com Sinônimos
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center h-8">
            <h2 className="text-xl font-semibold text-sky-800 flex items-center gap-2">
              <i className="fas fa-sparkles text-blue-500"></i> Texto Transcrito
            </h2>
            {status === AppStatus.SUCCESS && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 animate-pulse">
                Concluído!
              </span>
            )}
          </div>
          
          <div className="relative group">
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="O resultado aparecerá aqui..."
              readOnly={status === AppStatus.LOADING}
              className={`w-full h-80 p-6 rounded-3xl glass shadow-xl focus:ring-4 focus:ring-sky-200 focus:outline-none transition-all resize-none text-sky-900 leading-relaxed placeholder-sky-400 ${
                status === AppStatus.LOADING ? 'opacity-50' : 'opacity-100'
              }`}
            />
            
            <div className="absolute top-4 right-4 flex gap-2">
              {status === AppStatus.SUCCESS && (
                <button
                  onClick={handleCopy}
                  className={`p-3 rounded-xl transition-all shadow-md flex items-center gap-2 ${
                    copySuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white text-sky-600 hover:bg-sky-50'
                  }`}
                  title="Copiar Texto"
                >
                  <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  <span className="text-xs font-bold">{copySuccess ? 'Copiado!' : 'Copiar'}</span>
                </button>
              )}
            </div>
          </div>

          {status === AppStatus.ERROR && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-lg"></i>
              {errorMessage}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-blue-100/30 border border-blue-200/50">
            <h3 className="text-sky-900 font-bold mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-500"></i> Dica de Uso
            </h3>
            <p className="text-sky-700 text-sm leading-relaxed">
              Você pode editar o texto gerado diretamente no campo acima caso queira fazer ajustes manuais. O Transcrever Online utiliza tecnologia avançada para sugerir as melhores variações linguísticas.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-sky-200 text-center text-sky-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Transcrever Online. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-sky-800 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-sky-800 transition-colors">Termos</a>
          <a href="#" className="hover:text-sky-800 transition-colors">Suporte</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
