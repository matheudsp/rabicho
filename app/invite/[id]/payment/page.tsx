// app/invite/[id]/payment/page.tsx
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
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    async function fetchPlanos() {
      try {
        const response = await fetch(`/api/plans`);

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          console.error("Error response from API:", errorData);
          setPlanos([]);
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Verifica se data é um array
        if (Array.isArray(data)) {
          setPlanos(data);

          // Definir o plano padrão (médio)
          if (data.length > 0) {
            // Seleciona o plano do meio se houver mais de um
            const defaultPlanIndex = Math.min(1, data.length - 1);
            setSelectedPlan(data[defaultPlanIndex].id);
          }
        } else {
          console.error("Dados recebidos não são um array:", data);
          setPlanos([]); // Inicializa como array vazio para evitar erros
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
      const planResponse = await fetch(`/api/invite/${id}/plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      if (!planResponse.ok) {
        throw new Error("Falha ao associar o plano ao convite");
      }

      // Aguardar um momento para garantir que a associação seja concluída no banco de dados
      // Isso é especialmente importante em ambientes serverless
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em seguida, iniciar o checkout
      await createMercadoPagoCheckout({
        conviteId: id,
        userEmail: email || undefined
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

  // Se não houver planos, mostrar mensagem
  if (planos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Nenhum plano disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Selecione um Plano</h1>

      <div className="flex flex-col gap-4 mb-6">
        {planos.map((plano) => (
          <div
            key={plano.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedPlan === plano.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            )}
            onClick={() => setSelectedPlan(plano.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{plano.nome}</h2>
              <div className={cn(
                "h-4 w-4 rounded-full border-2",
                selectedPlan === plano.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              )}></div>
            </div>

            <p className="text-gray-600 text-sm mb-3">{plano.descricao}</p>

            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </p>
              <span className="text-sm text-gray-600">
                {plano.quantidade_respostas} resposta{plano.quantidade_respostas > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5">
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
        <p className="mt-1 text-xs text-gray-500">
          Enviaremos o recibo de pagamento para este e-mail
        </p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={!selectedPlan || paymentProcessing}
        className={cn(
          "w-full bg-blue-500 text-white py-3 rounded-md font-medium",
          (!selectedPlan || paymentProcessing) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        )}
      >
        {paymentProcessing ? "Processando..." : "Prosseguir para o pagamento"}
      </button>
    </div>
  );
}