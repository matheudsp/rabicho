"use client"

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Share2, Copy, X } from "lucide-react";
// Componente para o modal de compartilhamento
export default function ShareModalItem({ conviteId }: { conviteId: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    // Usando window.location.origin no cliente
    const shareUrl = `${window.location.origin}/invite/${conviteId}/response`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <DropdownMenu.Item asChild onSelect={(e) => e.preventDefault()}>
          <button
            className="p-2 rounded-md hover:bg-accent flex items-center justify-between w-full"
            aria-label="Compartilhar convite"
            title="Compartilhar convite"
          >
            Compartilhar
            <Share2 size={18} />
          </button>
        </DropdownMenu.Item>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-lg shadow-lg border border-border w-[90%] max-w-xs">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Compartilhar convite</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-accent">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Link do convite:</p>
            <div className="flex items-center gap-2">
              <div className="bg-accent p-2 rounded text-sm flex-1 truncate">
                {typeof window !== "undefined" ? `${window.location.origin}/invite/${conviteId}/response` : `/invite/${conviteId}/response`}
              </div>
              <button 
                onClick={handleCopyLink}
                className={`p-2 rounded-md ${copied ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
              >
                {copied ? "Copiado!" : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Dialog.Close asChild>
              <button className="bg-accent hover:bg-accent/80 px-4 py-2 rounded-md">
                Fechar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}