import { useState } from 'react';

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async () => {
    if (!inputUsuario) return;
    
    const novaMensagemPaciente = { remetente: 'paciente', texto: inputUsuario };
    setMensagens(msgsAntigas => [...msgsAntigas, novaMensagemPaciente]);
    setInputUsuario('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          paciente_id: "uuid-123",
          mensagem: novaMensagemPaciente.texto
        })
      });

      if (!resposta.ok) {
        throw new Error('Falha na comunicação com a API do servidor');
      }

      const dadosIA = await resposta.json();
      
      const novaMensagemIA = { 
        remetente: 'ia', 
        texto: dadosIA.resposta || dadosIA.texto || "Resposta recebida, mas formato inesperado.", 
        fontes: dadosIA.fontes || [] 
      };
      
      setMensagens(msgsAntigas => [...msgsAntigas, novaMensagemIA]);
    } catch (erro) {
      console.error("Erro detalhado na requisição:", erro);
      const mensagemErro = { 
        remetente: 'ia', 
        texto: "Desculpe, ocorreu um erro de conexão com o motor vetorial. Verifique se o servidor está rodando e se as políticas de acesso permitem a comunicação.", 
        fontes: [] 
      };
      setMensagens(msgsAntigas => [...msgsAntigas, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  const lidarComUpload = (evento) => {
    const arquivo = evento.target.files[0];
    if (arquivo) {
      const msgUpload = { remetente: 'ia', texto: `O arquivo PDF "${arquivo.name}" foi processado e estruturado. O que você gostaria de saber sobre o laudo?` };
      setMensagens([...mensagens, msgUpload]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans text-[16px] leading-[2.1]">
      <div className="w-full max-w-3xl bg-[#070707] border border-gray-800 rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col h-[82vh]">
        <div className="bg-black text-white px-8 py-6 text-center border-b border-gray-800">
          <h1 className="text-[20px] font-bold">Genera Intelligence</h1>
          <p className="mt-2 text-base text-gray-400 max-w-2xl mx-auto leading-[2.1]">
            Assistente Especializado em Laudos Genéticos.
          </p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[#090909] space-y-4">
          {mensagens.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              Faça o upload do seu laudo em PDF ou digite sua dúvida clínica abaixo.
            </div>
          ) : (
            mensagens.map((msg, index) => (
              <div key={index} className={`flex ${msg.remetente === 'paciente' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-5 rounded-[24px] shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${msg.remetente === 'paciente' ? 'bg-white text-black border border-gray-200' : 'bg-gray-800 text-white border border-gray-700'}`}>
                  <p className="text-[16px] leading-[2.2]">{msg.texto}</p>
                  {msg.fontes && msg.fontes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 leading-[1.9]">
                      <span className="font-semibold">Fontes extraídas:</span> {msg.fontes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {carregando && (
            <div className="flex justify-start">
              <p className="inline-block px-5 py-4 rounded-[24px] bg-gray-800 text-white text-[14px] italic">
                Analisando informações...
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-5 bg-[#070707] border-t border-gray-800">
          <div className="flex flex-col gap-4">
            <label className="inline-flex items-center justify-center rounded-full bg-white text-black font-bold px-6 py-4 shadow-sm hover:bg-gray-200 transition-colors cursor-pointer text-base">
              📎 PDF
              <input type="file" accept=".pdf" className="hidden" onChange={lidarComUpload} />
            </label>
            <input
              type="text"
              className="w-full rounded-full bg-gray-950 border border-gray-800 text-white px-5 py-4 placeholder-gray-500 text-base leading-[2.1] focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Ex: Qual meu risco para câncer de mama?"
              value={inputUsuario}
              onChange={(e) => setInputUsuario(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            />
            <button
              className="w-full rounded-full bg-white text-black font-bold px-6 py-4 shadow-sm hover:bg-gray-200 transition-colors text-base"
              onClick={enviarMensagem}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-5 text-center px-4 max-w-3xl leading-7">
        Aviso de Segurança e Governança: Este assistente utiliza IA generativa para a estruturação de laudos. As informações não substituem um diagnóstico médico invasivo ou profissional.
      </p>
    </div>
  );
}
