"use client"

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Share2, Copy, X } from "lucide-react";

type ShareModalProps = {
  // ID do item a ser compartilhado (convite ou resposta)
  itemId: string;
  // Caminho personalizado para o compartilhamento
  pathType?: 'response' | 'see-response';
  // Texto personalizado para o botão e título
  buttonText?: string;
  modalTitle?: string;
  // Opção para renderizar como item de dropdown ou como botão independente
  asDropdownItem?: boolean;
};

// Componente para o modal de compartilhamento
export default function ShareModal({
  itemId,
  pathType = 'response',
  buttonText = 'Compartilhar',
  modalTitle = 'Compartilhar convite',
  asDropdownItem = true,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Determina o caminho com base no tipo
  const getSharePath = () => {
    switch (pathType) {
      case 'see-response':
        return `/invite/${itemId}/see-response`;
      case 'response':
      default:
        return `/invite/${itemId}/response`;
    }
  };

  const handleCopyLink = () => {
    // Usando window.location.origin no cliente
    const shareUrl = `${window.location.origin}${getSharePath()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Renderiza o trigger do modal baseado na propriedade asDropdownItem
  const renderTrigger = () => {
    if (asDropdownItem) {
      return (
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <button
            className="p-2 rounded-md hover:bg-primary-foreground flex items-center justify-between w-full"
            aria-label={buttonText}
            title={buttonText}
          >
            {buttonText}
            <Share2 size={18} />
          </button>
        </DropdownMenu.Item>
      );
    }

    return (
      <button
        className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
        aria-label={buttonText}
        title={buttonText}
      >
        <Share2 size={18} />
        {buttonText}
      </button>
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {renderTrigger()}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-lg shadow-lg border border-border w-[90%] max-w-xs">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">{modalTitle}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-accent">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Link para compartilhar:</p>
            <div className="flex items-center gap-2">
              <div className="bg-accent p-2 rounded text-sm flex-1 truncate">
                {typeof window !== "undefined" ? `${window.location.origin}${getSharePath()}` : getSharePath()}
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

// Componente específico para uso na página Home (mantém API existente)
export function ShareModalItem({ conviteId }: { conviteId: string }) {
  return (
    <ShareModal
      itemId={conviteId}
      pathType="response"
      buttonText="Compartilhar"
      modalTitle="Compartilhar convite"
      asDropdownItem={true}
    />
  );
}