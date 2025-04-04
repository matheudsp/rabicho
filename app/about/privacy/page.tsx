// app/privacidade/page.tsx
import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
          <p>
            Sua privacidade é importante para nós. Esta Política de Privacidade explica como o Rabicho coleta, usa, divulga e protege suas informações pessoais quando você utiliza nosso serviço.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Informações Coletadas</h2>
          <p>Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Informações de cadastro:</strong> nome, endereço de e-mail, número de telefone.</li>
            <li><strong>Informações de uso:</strong> dados sobre como você interage com nosso serviço.</li>
            <li><strong>Informações do dispositivo:</strong> tipo de dispositivo, sistema operacional, navegador.</li>
            <li><strong>Informações de convites:</strong> dados relacionados aos convites que você cria e gerencia.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Uso das Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Fornecer e manter nosso serviço</li>
            <li>Melhorar e personalizar sua experiência</li>
            <li>Processar transações</li>
            <li>Enviar notificações relacionadas ao serviço</li>
            <li>Prevenir fraudes e abusos</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais a terceiros. Podemos compartilhar informações nas seguintes circunstâncias:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Com provedores de serviços que nos ajudam a operar o Rabicho</li>
            <li>Para cumprir obrigações legais</li>
            <li>Para proteger direitos, propriedade ou segurança</li>
            <li>Com seu consentimento explícito</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Segurança</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Seus Direitos</h2>
          <p>
            Você tem direitos em relação às suas informações pessoais, incluindo:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Acessar suas informações</li>
            <li>Corrigir informações imprecisas</li>
            <li>Excluir suas informações</li>
            <li>Restringir ou opor-se ao processamento</li>
            <li>Solicitar a portabilidade dos dados</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Cookies e Tecnologias Semelhantes</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, analisar o uso do serviço e personalizar conteúdo. Para mais informações, consulte nossa <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Alterações nesta Política</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através de um aviso em nosso serviço ou por outros meios.
          </p>
        </section>
      </div>
      
      <div className="mt-10">
        <p>Para exercer seus direitos ou tirar dúvidas sobre esta Política de Privacidade, entre em contato conosco através da página de <Link href="/contato" className="text-primary hover:underline">Contato</Link>.</p>
      </div>
    </div>
  );
}