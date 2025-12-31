
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <div className="inline-block p-2 px-6 rounded-full glass mb-4 shadow-sm">
        <span className="text-sky-600 font-semibold tracking-wider text-xs uppercase">Inteligência Artificial & Linguística</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4 tracking-tight">
        Transcrever <span className="text-blue-500">Online</span>
      </h1>
      <p className="text-sky-700 max-w-xl mx-auto text-lg">
        Enriqueça seu conteúdo instantaneamente. Cole seu texto e deixe nossa IA encontrar os melhores sinônimos para você.
      </p>
    </header>
  );
};

export default Header;
