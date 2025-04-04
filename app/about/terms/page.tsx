// app/termos/page.tsx
import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o Rabicho ("Serviço"), você concorda com estes Termos de Uso. Se você não concorda com alguma parte destes termos, pedimos que não utilize nosso serviço.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
          <p>
            O Rabicho é um aplicativo de convites digitais que permite aos usuários criar e gerenciar convites para eventos, com preços dinâmicos baseados na quantidade de respostas recebidas.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Conta de Usuário</h2>
          <p>
            Para utilizar determinadas funcionalidades do Serviço, é necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Uso Aceitável</h2>
          <p>
            Ao utilizar o Rabicho, você concorda em não:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Violar leis ou regulamentos aplicáveis</li>
            <li>Publicar conteúdo ofensivo, obsceno ou difamatório</li>
            <li>Enviar spam ou mensagens não solicitadas</li>
            <li>Tentar acessar áreas restritas do serviço</li>
            <li>Interferir na operação normal do serviço</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Conteúdo do Usuário</h2>
          <p>
            Você retém todos os direitos sobre o conteúdo que compartilha através do Rabicho, mas concede uma licença limitada para que possamos armazenar, exibir e utilizar esse conteúdo para fornecer o Serviço.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Modificações do Serviço</h2>
          <p>
            Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o Serviço (ou qualquer parte dele) com ou sem aviso prévio.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitação de Responsabilidade</h2>
          <p>
            O Rabicho é fornecido "como está", sem garantias de qualquer tipo. Não seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes resultantes do uso ou da incapacidade de usar o Serviço.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Alterações nos Termos</h2>
          <p>
            Podemos atualizar estes Termos de Uso periodicamente. As alterações entrarão em vigor assim que forem publicadas. O uso continuado do Serviço após tais alterações constitui sua aceitação dos novos termos.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">9. Lei Aplicável</h2>
          <p>
            Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, independentemente dos conflitos de disposições legais.
          </p>
        </section>
      </div>
      
      <div className="mt-10">
        <p>Para quaisquer dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de <Link href="/contato" className="text-primary hover:underline">Contato</Link>.</p>
      </div>
    </div>
  );
}