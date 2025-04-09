"use client";

import { useState, useEffect, use } from "react";
import useMercadoPago from "@/hooks/useMercadoPago";
import { cn } from "@/lib/utils";

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  quantidade_respostas: number;
  preco: number;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { createMercadoPagoCheckout } = useMercadoPago();
  const [plans, setPlans] = useState<Plano[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    async function fetchPlanos() {
      try {
        const response = await fetch(`/api/plans`);
        const data = await response.json();
        setPlans(data);
        
        // Definir o plano padrão (médio)
        if (data.length > 0) {
          // Seleciona o plano do meio se houver mais de um
          const defaultPlanIndex = Math.min(1, data.length - 1);
          setSelectedPlan(data[defaultPlanIndex].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        setLoading(false);
      }
    }
    
    fetchPlanos();
  }, []);

  async function handleCheckout() {
    if (!selectedPlan) {
      alert("Por favor, selecione um plano");
      return;
    }
    
    setPaymentProcessing(true);
    
    try {
      // Primeiro, associar o plano ao convite
      await fetch(`/api/invite/${id}/plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planoId: selectedPlan }),
      });
      
      // Em seguida, iniciar o checkout
      await createMercadoPagoCheckout({
        conviteId: id,
        userEmail: email || undefined,
      });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentProcessing(false);
      alert("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Selecione um Plano</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={cn(
              "border rounded-lg p-6 cursor-pointer transition-all",
              selectedPlan === plan.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300"
            )}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.nome}</h2>
            <p className="text-gray-600 mb-4">{plan.descricao}</p>
            <p className="text-3xl font-bold mb-3">
              R$ {plan.preco.toFixed(2).replace('.', ',')}
            </p>
            <ul className="text-sm mb-4">
              <li className="flex items-center mb-1">
                <span className="mr-2">✓</span>
                {plan.quantidade_respostas} resposta{plan.quantidade_respostas > 1 ? 's' : ''}
              </li>
              <li className="flex items-center mb-1">
                <span className="mr-2">✓</span>
                Personalização de convite
              </li>
            </ul>
            <div className="mt-4">
              <div className={cn(
                "h-4 w-4 rounded-full border-2",
                selectedPlan === plan.id 
                  ? "border-blue-500 bg-blue-500" 
                  : "border-gray-300"
              )}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Seu e-mail (opcional)
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="seu@email.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enviaremos o recibo de pagamento para este e-mail
        </p>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={!selectedPlan || paymentProcessing}
        className={cn(
          "w-full bg-blue-500 text-white px-6 py-3 rounded-md font-medium",
          (!selectedPlan || paymentProcessing) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        )}
      >
        {paymentProcessing ? "Processando..." : "Prosseguir para o pagamento"}
      </button>
    </div>
  );
}