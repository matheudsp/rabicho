import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HomePage from "@/components/pages/HomePage";
import { toast } from "react-hot-toast";

// Definindo tipos baseados no banco de dados
type Convite = {
  id: string;
  titulo: string;
  criado_por: string;
  data_criacao: string;
  pago: boolean;
};

type Formulario = {
  id: number;
  convite_id: string;
};

type Pergunta = {
  id: number;
  formulario_id: number;
};

type Resposta = {
  pergunta_id: number;
  convidado_id: string;
};

// Tipo estendido do convite com contagem de respostas
type ConviteComRespostas = Convite & {
  respostas_count: number;
};

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Buscar convites e contagem de respostas em uma única operação
  try {
    const { data: convites, error } = await supabase
      .from("convites")
      .select("*")
      .eq("criado_por", user.id)
      .order("data_criacao", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar convites");
      return <div>Erro ao carregar convites</div>;
    }

    // Otimizar a contagem de respostas com uma única consulta para todos os convites
    const convitesIds = (convites || []).map(convite => convite.id);
    
    // Query para buscar formulários para todos os convites de uma vez
    const { data: formularios, error: formError } = await supabase
      .from("formularios")
      .select("id, convite_id")
      .in("convite_id", convitesIds);
      
    if (formError) {
      toast.error("Erro ao carregar formulários");
    }
    
    // Mapear formulários por convite_id para uso posterior
    const formulariosPorConvite: Record<string, number[]> = {};
    (formularios || []).forEach((form: Formulario) => {
      formulariosPorConvite[form.convite_id] = formulariosPorConvite[form.convite_id] || [];
      formulariosPorConvite[form.convite_id].push(form.id);
    });
    
    // Obter todos os IDs de formulários
    const todosFormularioIds = (formularios || []).map(f => f.id);
    
    // Se não há formulários, retornar convites com contagem zero
    if (todosFormularioIds.length === 0) {
      const convitesComRespostasZero: ConviteComRespostas[] = (convites || []).map(convite => ({
        ...convite,
        respostas_count: 0
      }));
      
      return (
        <HomePage
          convites={convitesComRespostasZero}
          userLoggedIn={!!user}
        />
      );
    }
    
    // Buscar todas as perguntas para todos os formulários de uma vez
    const { data: perguntas, error: perguntasError } = await supabase
      .from("perguntas")
      .select("id, formulario_id")
      .in("formulario_id", todosFormularioIds);
      
    if (perguntasError) {
      toast.error("Erro ao carregar perguntas");
    }
    
    // Mapear perguntas por formulario_id
    const perguntasPorFormulario: Record<number, number[]> = {};
    (perguntas || []).forEach((pergunta: Pergunta) => {
      perguntasPorFormulario[pergunta.formulario_id] = perguntasPorFormulario[pergunta.formulario_id] || [];
      perguntasPorFormulario[pergunta.formulario_id].push(pergunta.id);
    });
    
    // Obter todos os IDs de perguntas
    const todasPerguntasIds = (perguntas || []).map(p => p.id);
    
    // Se não há perguntas, retornar convites com contagem zero
    if (todasPerguntasIds.length === 0) {
      const convitesComRespostasZero: ConviteComRespostas[] = (convites || []).map(convite => ({
        ...convite,
        respostas_count: 0
      }));
      
      return (
        <HomePage
          convites={convitesComRespostasZero}
          userLoggedIn={!!user}
        />
      );
    }
    
    // Buscar todas as respostas para todas as perguntas de uma vez
    const { data: todasRespostas, error: respostasError } = await supabase
      .from("respostas")
      .select("convidado_id, pergunta_id")
      .in("pergunta_id", todasPerguntasIds);
      
    if (respostasError) {
      toast.error("Erro ao carregar respostas");
    }
    
    // Mapear respostas por pergunta_id
    const respostasPorPergunta: Record<number, string[]> = {};
    (todasRespostas || []).forEach((resposta: Resposta) => {
      respostasPorPergunta[resposta.pergunta_id] = respostasPorPergunta[resposta.pergunta_id] || [];
      respostasPorPergunta[resposta.pergunta_id].push(resposta.convidado_id);
    });
    
    // Calcular contagem de convidados únicos para cada convite
    const convitesComRespostas: ConviteComRespostas[] = (convites || []).map(convite => {
      // Obter IDs de formulários para este convite
      const formularioIdsDoConvite = formulariosPorConvite[convite.id] || [];
      
      // Obter todos os IDs de perguntas para estes formulários
      const perguntaIdsDoConvite: number[] = [];
      formularioIdsDoConvite.forEach(formId => {
        const perguntasDoFormulario = perguntasPorFormulario[formId] || [];
        perguntaIdsDoConvite.push(...perguntasDoFormulario);
      });
      
      // Obter todos os IDs de convidados que responderam a estas perguntas
      const convidadoIdsDoConvite: string[] = [];
      perguntaIdsDoConvite.forEach(pergId => {
        const convidadosDaPergunta = respostasPorPergunta[pergId] || [];
        convidadoIdsDoConvite.push(...convidadosDaPergunta);
      });
      
      // Contar convidados únicos
      const convidadosUnicos = new Set(convidadoIdsDoConvite);
      
      return {
        ...convite,
        respostas_count: convidadosUnicos.size
      };
    });

    return (
      <HomePage
        convites={convitesComRespostas}
        userLoggedIn={!!user}
      />
    );
  } catch (error) {
    toast.error("Ocorreu um erro ao processar os convites");
    return <div>Erro ao processar dados. Por favor, tente novamente.</div>;
  }
}