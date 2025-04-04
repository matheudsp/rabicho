import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon, UserIcon } from "lucide-react";
import { signOutAction } from "@/app/actions";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Formatar a data de criação da conta
  const createdAt = user.created_at ? new Date(user.created_at) : new Date();
  const formattedDate = createdAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="w-full border rounded-lg shadow-sm bg-card text-card-foreground">
        <div className="flex flex-row items-center gap-4 p-6 pb-2">
          <div className="bg-primary text-primary-foreground rounded-full p-3">
            <UserIcon size={24} />
          </div>
          <h2 className="text-xl font-semibold">Meu Perfil</h2>
        </div>
        <div className="p-6 pt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">E-mail</h3>
              <p className="text-base">{user.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Data de cadastro</h3>
              <p className="text-base">{formattedDate}</p>
            </div>

            {user.user_metadata && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                <p className="text-base">{user.user_metadata.full_name || "Não informado"}</p>
              </div>
            )}

            <div className="pt-4">
              <form action={signOutAction}>
                <Button type="submit" variant="destructive" className="w-full flex items-center gap-2">
                  <LogOutIcon size={18} />
                  Sair da conta
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}