'use client'

import { InfoIcon, PlusCircle, Share2, Trash2, Eye, CheckCircle, XCircle, EllipsisVertical, Copy, X } from "lucide-react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ShareModalItem from "@/components/shareModal";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { deleteInvite } from "@/app/actions";

// Tipo para os convites baseado no seu banco de dados
type Convite = {
  id: string;
  titulo: string;  // Alterado de nome_destinatario para titulo
  criado_por: string;
  data_criacao: string;
  pago: boolean;
  respostas_count: number;  // Adicionado contador de respostas
};

type HomePageProps = {
  convites: Convite[];
  userLoggedIn: boolean;
};

export default function HomePage({ convites, userLoggedIn }: HomePageProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConvite, setSelectedConvite] = useState<Convite | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (convite: Convite) => {
    setSelectedConvite(convite);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedConvite(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedConvite) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteInvite(selectedConvite.id);
      if (result.success) {
        setDeleteModalOpen(false);
        router.refresh();
      } else {
        console.error("Erro ao excluir:", result.error);
        // Você pode adicionar uma notificação de erro aqui
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-[70vh] mx-auto gap-4 flex flex-col border-x border-border">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Essa é a sua página de convites. Crie, gerencie e compartilhe seus convites.
        </div>
      </div>

      {/* Botão para criar novo convite */}
      <div className="flex justify-center ">
        <Link
          href="/invite/create-invite"
          className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle size={18} />
          Criar novo convite
        </Link>
      </div>

      {/* Lista de convites */}
      <div className="flex flex-col gap-4 p-4">
        <h2 className="font-bold text-xl">Seus convites</h2>

        {convites && convites.length > 0 ? (
          <div className="flex flex-col gap-3">
            {convites.map((convite: Convite) => (
              <div key={convite.id} className="border rounded-md p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{convite.titulo}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(convite.data_criacao).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-blue-600">
                        <CheckCircle size={12} /> {convite.respostas_count || 0} resposta(s)
                      </span>
                    </div>
                  </div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="outline" className="text-sm">
                        <EllipsisVertical size={18} />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-background border border-border flex flex-col rounded-md shadow-md p-2"
                        align="end"
                        sideOffset={8}
                      >
                        <DropdownMenu.Item asChild className="p-2 rounded hover:border flex-row flex items-center justify-between hover:border-border">
                          <Link
                            href={`/invite/${convite.id}/see-response`}
                            className="p-2 rounded-md flex-wrap ease-linear hover:bg-accent"
                            aria-label="Ver respostas"
                            title="Ver respostas"
                          >
                            Ver respostas
                            <Eye size={18} />
                          </Link>
                        </DropdownMenu.Item>
                        
                        <ShareModalItem conviteId={convite.id} />
                        
                        <DropdownMenu.Item asChild className="p-2 rounded hover:border flex-row flex items-center justify-between hover:border-border">
                          <button
                            className="p-2 rounded-md hover:bg-accent text-destructive"
                            aria-label="Excluir convite"
                            title="Excluir convite"
                            onClick={() => handleDeleteClick(convite)}
                          >
                            Excluir
                            <Trash2 size={18} />
                          </button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-md p-6 text-center">
            <p className="text-muted-foreground">Você ainda não criou nenhum convite.</p>
            <p className="text-sm mt-2">Clique em "Criar novo convite" para começar!</p>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {selectedConvite && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          conviteId={selectedConvite.id}
          conviteName={selectedConvite.titulo} // Alterado de nome_destinatario para titulo
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}