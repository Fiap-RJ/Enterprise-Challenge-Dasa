import { useState } from 'react';

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState('');

  const enviarMensagem = () => {
    if (!inputUsuario) return;
    const novaMensagem = { remetente: 'paciente', texto: inputUsuario };
    setMensagens([...mensagens, novaMensagem]);
    setInputUsuario('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="bg-blue-900 text-white p-4 text-center border-b">
          <h1 className="text-xl font-bold">Genera Intelligence</h1>
          <p className="text-sm opacity-80">Assistente Especializado em Laudos Genéticos</p>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
          {mensagens.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              Faça o upload do seu laudo em PDF ou digite sua dúvida clínica abaixo.
            </div>
          ) : (
            mensagens.map((msg, index) => (
              <div key={index} className="mb-4 text-right">
                <p className="inline-block p-3 rounded-lg bg-blue-600 text-white shadow-sm">
                  {msg.texto}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Digite sua dúvida sobre os marcadores e riscos..."
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
          />
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            onClick={enviarMensagem}
          >
            Analisar
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center px-4">
        Aviso de Segurança e Governança: Este assistente utiliza IA generativa para a estruturação de laudos. As informações não substituem um diagnóstico médico invasivo ou profissional.
      </p>
    </div>
  );
}