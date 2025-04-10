'use client'
import { useState } from 'react';
import { Music, Users, Calendar, Mail, MapPin, Heart, Ghost, Cake } from 'lucide-react';
import Link from 'next/link';
type ConviteType = 'jantar' | 'halloween' | 'casamento';

export default function ConvitesDemo() {
  const [activeConvite, setActiveConvite] = useState<ConviteType>('jantar');

  // Dados dos convites
  const convites = {
    jantar: {
      id: '9b5eefa4-d589-4e34-b2ed-7b7faef7e44f',
      titulo: "Jantar Especial na Casa dos Silva",
      tema: "elegante",
      plano: "Convite Básico",
      data: "15 de Maio de 2025",
      local: "Residência da Família Silva",
      descricao: "Temos o prazer de convidá-lo para um jantar especial em nossa residência. Uma noite de boa comida e excelente companhia.",
      hora: "20:00",
      bgClass: "bg-slate-50",
      textClass: "text-slate-800",
      borderClass: "border-slate-200",
      accentClass: "bg-indigo-100 text-indigo-800",
      icon: <Cake className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
    },
    halloween: {
      id: 'ca6b9e62-810e-4aee-8d0a-b7b3a9665dff',
      titulo: "Noite de Halloween Assustadora",
      tema: "divertido",
      plano: "Convite Grupo",
      data: "31 de Outubro de 2025",
      local: "Mansão Fantasma - Rua das Bruxas, 666",
      descricao: "Prepare-se para a noite mais aterrorizante do ano! Traga sua fantasia mais assustadora e venha se divertir conosco.",
      hora: "21:00",
      bgClass: "bg-orange-50",
      textClass: "text-orange-900",
      borderClass: "border-orange-200",
      accentClass: "bg-orange-100 text-orange-800",
      icon: <Ghost className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
    },
    casamento: {
      id: '6003e505-332c-4c65-a66a-d8c9e5eb5bce',
      titulo: "Casamento de Maria e João",
      tema: "romantico",
      plano: "Convite Evento",
      data: "20 de Junho de 2025",
      local: "Capela Santa Rosa & Salão de Festas Primavera",
      descricao: "Com a bênção de nossas famílias, temos a honra de convidá-lo para celebrar nossa união matrimonial.",
      hora: "16:00 - Cerimônia | 19:00 - Recepção",
      bgClass: "bg-rose-50",
      textClass: "text-rose-900",
      borderClass: "border-rose-200",
      accentClass: "bg-rose-100 text-rose-800",
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
    }
  };

  const activeConviteData = convites[activeConvite];

  // Componente para exibir o preview de um convite específico
  const ConvitePreview = () => (
    <div className={`p-4 md:p-6 rounded-lg shadow-md border ${activeConviteData.borderClass} ${activeConviteData.bgClass} ${activeConviteData.textClass} w-full max-w-md mx-auto mt-4 md:mt-6`}>
      <div className="flex justify-between items-start">
        <div className="mr-3 md:mr-4">
          {activeConviteData.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-bold">{activeConviteData.titulo}</h2>
          <div className={`${activeConviteData.accentClass} text-xs px-2 py-1 rounded-full inline-block mt-1`}>
            {activeConviteData.tema} | {activeConviteData.plano}
          </div>
        </div>
      </div>

      <p className="mt-3 md:mt-4 text-sm md:text-base">{activeConviteData.descricao}</p>

      <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base">{activeConviteData.data}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base">{activeConviteData.local}</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base">Horário: {activeConviteData.hora}</span>
        </div>
        <div className="flex items-center">
          <Music className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base">Música temática incluída</span>
        </div>
      </div>

      <div className="mt-6 md:mt-8 border-t pt-4 border-dashed border-gray-300 w-full">
        <Link href={`/invite/${activeConviteData.id}/response`} >
          <div className="w-full flex justify-center items-center py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm md:text-base">
            Ver convite
          </div>

        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-2 md:p-4 w-full">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Demonstração de Convites</h1>

      {/* Botões de seleção para telas maiores */}
      <div className="hidden md:flex justify-center space-x-4 mb-6 md:mb-8">
        <button
          onClick={() => setActiveConvite('jantar')}
          className={`px-4 py-2 rounded-lg ${activeConvite === 'jantar'
            ? 'bg-indigo-100 text-indigo-800 font-medium'
            : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Jantar (Básico)
        </button>
        <button
          onClick={() => setActiveConvite('halloween')}
          className={`px-4 py-2 rounded-lg ${activeConvite === 'halloween'
            ? 'bg-orange-100 text-orange-800 font-medium'
            : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Halloween (Grupo)
        </button>
        <button
          onClick={() => setActiveConvite('casamento')}
          className={`px-4 py-2 rounded-lg ${activeConvite === 'casamento'
            ? 'bg-rose-100 text-rose-800 font-medium'
            : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Casamento (Evento)
        </button>
      </div>

      {/* Botões de seleção para dispositivos móveis (menu em linha) */}
      <div className="flex md:hidden justify-center mb-4">
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
          <button
            onClick={() => setActiveConvite('jantar')}
            className={`px-2 py-2 rounded-lg text-xs ${activeConvite === 'jantar'
              ? 'bg-indigo-100 text-indigo-800 font-medium'
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Jantar
          </button>
          <button
            onClick={() => setActiveConvite('halloween')}
            className={`px-2 py-2 rounded-lg text-xs ${activeConvite === 'halloween'
              ? 'bg-orange-100 text-orange-800 font-medium'
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Halloween
          </button>
          <button
            onClick={() => setActiveConvite('casamento')}
            className={`px-2 py-2 rounded-lg text-xs ${activeConvite === 'casamento'
              ? 'bg-rose-100 text-rose-800 font-medium'
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Casamento
          </button>
        </div>
      </div>

      <ConvitePreview />

      <div className="mt-4 md:mt-6 bg-gray-50 p-3 md:p-4 rounded-lg w-full max-w-md mx-auto text-xs md:text-sm">
        <p className="text-gray-600">
          <strong>Informações do plano:</strong><br />
          {activeConvite === 'jantar' && 'Convite Básico - Permite 1 resposta. Ideal para pequenos eventos pessoais.'}
          {activeConvite === 'halloween' && 'Convite Grupo - Permite 10 respostas. Perfeito para festas e reuniões.'}
          {activeConvite === 'casamento' && 'Convite Evento - Permite 100 respostas. Para grandes ocasiões como casamentos e formaturas.'}
        </p>
      </div>
    </div>
  );
}