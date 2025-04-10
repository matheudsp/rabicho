import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  conviteId: string;
  conviteName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  conviteId,
  conviteName,
  onClose,
  onConfirm,
  isDeleting
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Excluir convite</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isDeleting}>
            <X size={18} />
          </Button>
        </div>

        <div className="mb-6">
          <p className="mb-2">
            Tem certeza que deseja excluir o <strong>{conviteName}</strong>?
          </p>
          <p className="text-sm text-muted-foreground">
            Esta ação não pode ser desfeita e todas as respostas associadas serão removidas permanentemente.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir convite"}
          </Button>
        </div>
      </div>
    </div>
  );
}