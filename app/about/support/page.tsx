// app/contato/page.tsx
"use client";

import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';

export default function ContatoPage() {
  const supportEmail = "atendimentoaocliente.valedosol@gmail.com";
  const whatsappNumber = "+5500000000000"; // Substitua pelo seu número real
  
  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
  };
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };
  
  return (
    <div className="w-full max-w-sm mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Entre em Contato</h1>
      
      <div className="mb-6">
        <p className="text-base mb-4">
          Estamos aqui para ajudar! Se você tiver dúvidas, sugestões ou precisar de suporte, 
          use um dos métodos de contato abaixo.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-3">
            <FaEnvelope className="text-primary text-xl mr-2" />
            <h3 className="text-lg font-semibold">E-mail</h3>
          </div>
          <p className="mb-3 text-sm text-gray-600 break-words">{supportEmail}</p>
          <button 
            onClick={handleEmailClick}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <FaEnvelope className="mr-2" /> Enviar E-mail
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-3">
            <FaWhatsapp className="text-green-500 text-xl mr-2" />
            <h3 className="text-lg font-semibold">WhatsApp</h3>
          </div>
          <p className="mb-3 text-sm text-gray-600">Atendimento rápido via WhatsApp. (Indisponível)</p>
          <button 
            // onClick={handleWhatsAppClick}
            className="w-full cursor-not-allowed bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <FaWhatsapp className="mr-2" /> Falar no WhatsApp
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-base mb-2">Horário de Atendimento</h3>
        <p className="text-sm">Segunda a sexta: 9h às 18h</p>
        <p className="text-sm">Sábado: 9h às 13h</p>
      </div>
    </div>
  );
}