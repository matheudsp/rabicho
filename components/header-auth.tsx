import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOutIcon, User2Icon } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex">
          <Button variant="outline" className="text-sm md:flex hidden items-center">
            Olá, {user.email}! <ChevronDown size={24} />
          </Button>
          <Button variant="outline" className="text-sm flex md:hidden items-center">
            Meu perfil <ChevronDown size={24} />
          </Button>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal >
        <DropdownMenu.Content
          className="bg-background border border-border rounded-md shadow-md p-2 z-50"
          align="end"
          sideOffset={8}
        >
          <DropdownMenu.Item asChild className="p-2 rounded hover:border hover:border-border">
            <Link href="/profile" className="block flex-row flex gap-1 items-center">Perfil <User2Icon size={18} /></Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild onClick={signOutAction} className="">
            <Button type="submit" variant="destructive" size="sm" className="w-full flex-row flex gap-1 items-center">
              Sair
              <LogOutIcon size={18} />
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Cadastrar-se</Link>
      </Button>
    </div>
  );
}
