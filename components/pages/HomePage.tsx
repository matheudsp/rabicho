'use client'

import { InfoIcon, PlusCircle, Share2, Trash2, Eye, CheckCircle, XCircle, EllipsisVertical, Copy, X, CreditCard } from "lucide-react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ShareModalItem from "@/components/shareModal";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { deleteInvite } from "@/app/actions";

// Tipo atualizado para os convites incluindo informações do plano
type Convite = {
  id: string;
  titulo: string;
  criado_por: string;
  data_criacao: string;
  pago: boolean;
  respostas_count: number;
  plano_id?: number | null;
  plano_nome?: string | null;
  respostas_permitidas?: number | null;
  respostas_utilizadas?: number | null;
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

  const handlePaymentClick = (conviteId: string) => {
    router.push(`/invite/${conviteId}/payment`);
  };

  // Formatador de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
      <div className="flex justify-center">
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
                {/* Cabeçalho do convite */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base">{convite.titulo}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(convite.data_criacao)}
                  </span>
                </div>
                
                {/* Informações do status */}
                <div className="mb-3">
                  {convite.pago ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        <span className="text-sm font-medium">Pago</span>
                      </div>
                      
                      {convite.plano_nome && (
                        <div className="flex items-center text-sm text-blue-600 ml-5">
                          <span>Plano: {convite.plano_nome}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-muted-foreground ml-5">
                        <span>
                          {convite.respostas_count} respostas recebidas 
                          {convite.respostas_permitidas ? 
                            ` (${convite.respostas_utilizadas || 0}/${convite.respostas_permitidas} utilizadas)` : 
                            ''}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-amber-600">
                        <XCircle size={14} />
                        <span className="text-sm font-medium">Aguardando pagamento</span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-1 text-xs bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                        onClick={() => handlePaymentClick(convite.id)}
                      >
                        <CreditCard size={14} className="mr-1" /> Efetuar pagamento
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Barra de ações */}
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <div className="flex gap-2">
                    {convite.pago && (
                      <Link
                        href={`/invite/${convite.id}/see-response`}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye size={14} /> Ver respostas
                      </Link>
                    )}
                  </div>
                  
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVertical size={16} />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-background border border-border flex flex-col rounded-md shadow-md p-2 min-w-[150px]"
                        align="end"
                        sideOffset={5}
                      >
                        {convite.pago && (
                          <DropdownMenu.Item asChild className="p-2 rounded hover:bg-accent flex items-center justify-between">
                            <Link href={`/invite/${convite.id}/see-response`}>
                              Ver respostas
                              <Eye size={16} />
                            </Link>
                          </DropdownMenu.Item>
                        )}
                        
                        {!convite.pago && (
                          <DropdownMenu.Item asChild className="p-2 rounded hover:bg-accent flex items-center justify-between text-green-600">
                            <Link href={`/invite/${convite.id}/payment`}>
                              Pagar convite
                              <CreditCard size={16} />
                            </Link>
                          </DropdownMenu.Item>
                        )}
                        
                        <ShareModalItem itemId={convite.id} />
                        
                        <DropdownMenu.Item asChild className="p-2 rounded hover:bg-accent flex items-center justify-between text-destructive">
                          <button onClick={() => handleDeleteClick(convite)}>
                            Excluir
                            <Trash2 size={16} />
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
          conviteName={selectedConvite.titulo}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}