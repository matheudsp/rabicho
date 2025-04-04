// app/contato/page.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio - aqui você implementaria a lógica real de envio
    try {
      // Substituir por sua API real de envio de formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({
        nome: "",
        email: "",
        assunto: "",
        mensagem: ""
      });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Entre em Contato</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="mb-4">
            Estamos aqui para ajudar! Se você tiver dúvidas, sugestões ou precisar de suporte, preencha o formulário ou use um dos métodos de contato abaixo.
          </p>
          
          <div className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold">E-mail</h3>
              <p>contato@rabicho.com.br</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Redes Sociais</h3>
              <p>Instagram: @rabicho.app</p>
            </div>
            
            <div className="pt-4">
              <h3 className="font-semibold text-lg mb-2">Horário de Atendimento</h3>
              <p>Segunda a sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
            </div>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block mb-1 font-medium">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="assunto" className="block mb-1 font-medium">
                Assunto
              </label>
              <input
                type="text"
                id="assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="mensagem" className="block mb-1 font-medium">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}