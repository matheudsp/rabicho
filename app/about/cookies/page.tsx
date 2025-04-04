// app/cookies/page.tsx
import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      <p className="text-sm text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. O que são Cookies</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados em seu dispositivo (computador, tablet ou smartphone) quando você visita sites. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Como Utilizamos Cookies</h2>
          <p>O Rabicho utiliza cookies para diversas finalidades, incluindo:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site e do aplicativo.</li>
            <li><strong>Cookies de funcionalidade:</strong> permitem lembrar escolhas que você faz para melhorar sua experiência.</li>
            <li><strong>Cookies analíticos:</strong> nos ajudam a entender como os visitantes interagem com o site, possibilitando melhorias.</li>
            <li><strong>Cookies de autenticação:</strong> utilizados para reconhecer você quando retorna ao Rabicho.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Tipos Específicos de Cookies que Utilizamos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Cookies de sessão</h3>
              <p>Temporários, são excluídos quando você fecha o navegador. Utilizados para manter o estado da sessão.</p>
            </div>
            <div>
              <h3 className="font-medium">Cookies persistentes</h3>
              <p>Permanecem por um período específico em seu dispositivo. São utilizados para lembrar suas preferências.</p>
            </div>
            <div>
              <h3 className="font-medium">Cookies de terceiros</h3>
              <p>Colocados por serviços de terceiros que aparecem em nossas páginas, como ferramentas analíticas e widgets de redes sociais.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Gerenciamento de Cookies</h2>
          <p>
            A maioria dos navegadores permite controlar cookies através das configurações. Você pode configurar seu navegador para recusar todos os cookies ou indicar quando um cookie está sendo enviado. No entanto, isso pode afetar a funcionalidade do Rabicho.
          </p>
          <p className="mt-2">
            Métodos para gerenciar cookies variam de acordo com o navegador, mas geralmente estão localizados em "Preferências" ou no menu "Ferramentas".
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookies e Dados Pessoais</h2>
          <p>
            Quando os cookies coletam dados pessoais, o processamento é regido por nossa <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Alterações na Política de Cookies</h2>
          <p>
            Podemos atualizar esta política periodicamente para refletir alterações em nossas práticas de cookies. Recomendamos que você revise esta página regularmente para estar ciente de qualquer mudança.
          </p>
        </section>
      </div>
      
      <div className="mt-10">
        <p>Para quaisquer dúvidas sobre nossa Política de Cookies, entre em contato conosco através da página de <Link href="/contato" className="text-primary hover:underline">Contato</Link>.</p>
      </div>
    </div>
  );
}