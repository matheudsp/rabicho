import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: any) {
    try {
      console.log("Iniciando checkout com dados:", checkoutData);
      
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      console.log("Resposta da API de checkout:", data);

      if (!response.ok) {
        console.error("Erro na API de checkout:", data.error || "Erro desconhecido");
        throw new Error(data.error || "Falha ao criar checkout");
      }

      if (!data.initPoint) {
        console.error("initPoint não encontrado na resposta:", data);
        throw new Error("URL de checkout não encontrado na resposta");
      }

      router.push(data.initPoint);
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;