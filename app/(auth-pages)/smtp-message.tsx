import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4">
      <InfoIcon size={16} className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <small className="text-sm text-secondary-foreground">
          <strong> Nota:</strong> Este sistema encontra-se em fase de testes. Os envios de e-mails estão sujeitos a limites diários. Caso não receba o e-mail esperado, por gentileza, entre em contato com o suporte.
        </small>
        <div>
          <Link
            href="/about/support"
            className="text-primary/50 hover:text-primary flex items-center text-sm gap-1"
          >
            Suporte <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
