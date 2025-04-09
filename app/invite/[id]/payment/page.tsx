"use client";

import useMercadoPago from "@/hooks/useMercadoPago";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { createMercadoPagoCheckout } = useMercadoPago();
  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() =>
          createMercadoPagoCheckout({
            conviteId: id,
            userEmail: "mdsp.personal@gmail.com",
          })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Comprar
      </button>
    </div>
  );
}