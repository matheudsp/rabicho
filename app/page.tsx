'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Send, Calendar, Users, Star, Check, Sparkles } from 'lucide-react';
import ConvitesDemo from '@/components/convitesDemo';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Trigger confetti animation when page loads
  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(true);
    }, 500);
  }, []);

  // Generate confetti elements
  const confettiColors = ['#9d261e', '#e63946', '#ffb703', '#219ebc', '#8338ec'];
  const confettiElements = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 10 + 5;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const delay = Math.random() * 1;
    const duration = 2 + Math.random() * 2;
    const rotation = Math.random() * 360;
    
    return (
      <motion.div
        key={i}
        className="absolute"
        initial={{ 
          top: "50%", 
          left: "50%",
          rotate: 0,
          opacity: 0
        }}
        animate={{ 
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          rotate: rotation,
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: duration,
          delay: delay,
          ease: "easeOut"
        }}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        }}
      />
    );
  });

  const features = [
    {
      title: "Convites Personalizados",
      description: "Crie convites digitais exclusivos para qualquer ocasião com temas personalizados.",
      icon: <Gift className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-red-500 to-orange-500"
    },
    {
      title: "Controle de Convidados",
      description: "Gerencie suas listas de convidados e acompanhe as confirmações em tempo real.",
      icon: <Users className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-500"
    },
    {
      title: "Envio Simplificado",
      description: "Compartilhe seus convites por WhatsApp, email ou redes sociais com apenas um clique.",
      icon: <Send className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      title: "Lembretes Automáticos",
      description: "Configure lembretes para seus convidados não esquecerem do seu evento especial.",
      icon: <Calendar className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 3,49",
      period: "/convite",
      description: "Perfeito para um jantar",
      features: ["1 convite", "Até 1 convidados", "3 temas", "Formulários personalizados", "Estatísticas de visualização"],
      cta: "Comprar",
      highlighted: false
    },
    {
      name: "Grupo",
      price: "R$ 9,90",
      period: "/convite",
      description: "Ideal para eventos regulares",
      features: ["1 convite", "Até 10 convidados", "Todos os temas", "Formulários personalizados", "Estatísticas de visualização"],
      cta: "Comprar",
      highlighted: true
    },
    {
      name: "Evento",
      price: "R$ 19,90",
      period: "/convite",
      description: "Para ocasiões especiais",
      features: ["1 convite", "Até 100 convidados", "Todos os temas", "Formulários personalizados", "Estatísticas de visualização"],
      cta: "Comprar",
      highlighted: false
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiElements}
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#9d261e]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#9d261e]/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                  Convites que <span className="text-[#9d261e]">encantam</span>, respostas que <span className="text-[#9d261e]">simplificam</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-600">
                  Crie convites digitais memoráveis para qualquer ocasião e gerencie suas confirmações em um só lugar.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/sign-up" className="bg-[#9d261e] text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#9d261e]/20">
                      Começar Grátis <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9d261e]/20 to-orange-300/20 rounded-xl blur-xl" />
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                  <div className="p-2">
                    <ConvitesDemo />
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-5 -right-5 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" /> Novo!
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Stats */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#9d261e]">+Fácil</p>
              <p className="text-gray-600 mt-1">de gerenciar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#9d261e]">+Barato</p>
              <p className="text-gray-600 mt-1">que o convite convecional</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#9d261e] ">+Completo</p>
              <p className="text-gray-600 mt-1">com respostas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#9d261e]">+3</p>
              <p className="text-gray-600 mt-1">Temas</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simplifique seus convites</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              O Rabicho transforma a maneira como você cria e gerencia convites para seus eventos especiais.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-6 cursor-pointer transition-all duration-300 ${index === activeFeature ? feature.color : 'bg-white'} ${index === activeFeature ? 'text-white' : 'text-gray-800'} shadow-lg`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${index === activeFeature ? 'bg-white/20' : feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={`${index === activeFeature ? 'text-white/90' : 'text-gray-600'}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
     
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Convites para todas as ocasiões</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o convite perfeito para o seu evento, desde pequenos encontros até grandes celebrações.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-6 ${plan.highlighted ? 'bg-gradient-to-b from-[#9d261e]/95 to-[#9d261e] text-white ring-4 ring-[#9d261e]/20' : 'bg-white text-gray-800'} shadow-xl relative`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -10 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm opacity-80">{plan.period}</span>}
                </div>
                <p className={`mb-6 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`w-5 h-5 mr-2 ${plan.highlighted ? 'text-white' : 'text-[#9d261e]'} shrink-0 mt-0.5`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-auto"
                >
                  <Link 
                    href="/sign-up" 
                    className={`w-full block text-center py-3 px-4 rounded-lg font-medium ${
                      plan.highlighted 
                        ? 'bg-white text-[#9d261e]' 
                        : 'bg-[#9d261e] text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#9d261e]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Pronto para começar?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já estão simplificando seus convites com o Rabicho.
            </p>
            <motion.div
              className="mt-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-up" className="inline-block bg-white text-[#9d261e] px-8 py-3 rounded-lg font-medium shadow-lg">
                Criar minha conta
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}