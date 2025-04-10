"use client";

import { useState, useEffect, use } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Music, Palette } from "lucide-react";

import { BalloonAnimation, ConfettiExplosion, GlitterAnimation, HeartAnimation } from "@/components/themes/themesAnimations";
import { useThemeManager } from "@/components/themes/themeManager";

// Interfaces
interface Pergunta {
  id: number;
  texto: string;
  tipo: "resposta_curta" | "multipla_escolha";
  opcoes?: Opcao[];
}

interface Opcao {
  id: number;
  texto: string;
}

interface Resposta {
  perguntaId: number;
  resposta_texto?: string;
  resposta_opcao?: number;
  convidado_id?: string;
}
interface FormErrors {
  [key: string]: string;
}

export default function ResponderConvite({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  // Usando o ThemeManager
  const { themeOptions, musicOptions, getThemeById, getMusicById } = useThemeManager();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [convite, setConvite] = useState<any>(null);
  const [formulario, setFormulario] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [respondentName, setRespondentName] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [limiteRespostasAlcancado, setLimiteRespostasAlcancado] = useState<boolean>(false);

  // Estados para temas e música
  const [formData, setFormData] = useState<{ tema: string, musica: string | null }>({
    tema: "padrao",
    musica: null,
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);


  // Get current theme
  const currentTheme = getThemeById(formData.tema) || themeOptions[0];

  // Function to get the video ID from the music key
  const getMusicVideoId = (musicKey: string | null): string | null => {
    if (!musicKey) return null;
    const music = getMusicById(musicKey);
    return music ? music.url : null;
  };

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    checkAuth();
  }, [supabase]);
  
  // Buscar dados do convite e formulário
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Buscar convite
        const { data: conviteData, error: conviteError } = await supabase
          .from("convites")
          .select("*")
          .eq("id", id)
          .single();

        if (conviteError) throw conviteError;
        if (!conviteData) throw new Error("Convite não encontrado");

        // Verificar se o convite está pago e tem respostas disponíveis
        if (conviteData.pago === false) {
          toast.error("Este convite ainda não foi pago.");
          router.push('/home');
          return;
        }

        if (conviteData.respostas_utilizadas >= conviteData.respostas_permitidas) {
          setLimiteRespostasAlcancado(true);
          // Ainda mostramos a página, mas desabilitamos o formulário
        }

        setConvite(conviteData);

        // Aplicar tema e música do convite
        if (conviteData.tema) {
          setFormData(prev => ({ ...prev, tema: conviteData.tema }));
        }

        if (conviteData.musica) {
          setFormData(prev => ({ ...prev, musica: conviteData.musica }));
          setIsMusicPlaying(true);
        }

        // Buscar formulário
        const { data: formularioData, error: formularioError } = await supabase
          .from("formularios")
          .select("*")
          .eq("convite_id", conviteData.id)
          .single();

        if (formularioError) throw formularioError;
        setFormulario(formularioData);

        // Buscar perguntas
        const { data: perguntasData, error: perguntasError } = await supabase
          .from("perguntas")
          .select("*")
          .eq("formulario_id", formularioData.id)
          .order("id", { ascending: true });

        if (perguntasError) throw perguntasError;

        // Para cada pergunta, buscar as opções (caso seja de múltipla escolha)
        const perguntasCompletas = await Promise.all(
          perguntasData.map(async (pergunta) => {
            if (pergunta.tipo === "multipla_escolha") {
              const { data: opcoesData, error: opcoesError } = await supabase
                .from("opcoes")
                .select("*")
                .eq("pergunta_id", pergunta.id)
                .order("id", { ascending: true });

              if (opcoesError) throw opcoesError;

              return {
                ...pergunta,
                opcoes: opcoesData,
              };
            }
            return pergunta;
          })
        );

        setPerguntas(perguntasCompletas);

        // Inicializar o estado de respostas
        setRespostas(
          perguntasCompletas.map((pergunta) => ({
            perguntaId: pergunta.id,
            resposta_texto: "",
            resposta_opcao: undefined,
          }))
        );

      } catch (error) {
        console.error("Erro ao carregar dados:", error instanceof Error ? error.message : String(error));
        toast.error("Erro ao carregar o convite");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router, supabase]);

  // Manipular mudanças nas respostas de texto
  const handleTextChange = (perguntaId: number, value: string) => {
    setRespostas(
      respostas.map((resposta) =>
        resposta.perguntaId === perguntaId
          ? { ...resposta, resposta_texto: value }
          : resposta
      )
    );

    // Limpar erros ao digitar
    if (errors[`pergunta_${perguntaId}`]) {
      const newErrors = { ...errors };
      delete newErrors[`pergunta_${perguntaId}`];
      setErrors(newErrors);
    }
  };

  // Manipular mudanças no nome do respondente
  const handleNameChange = (value: string) => {
    setRespondentName(value);

    // Limpar erro do nome
    if (errors['respondent_name']) {
      const newErrors = { ...errors };
      delete newErrors['respondent_name'];
      setErrors(newErrors);
    }
  };

  // Manipular mudanças nas respostas de múltipla escolha
  const handleOptionChange = (perguntaId: number, opcaoId: number) => {
    setRespostas(
      respostas.map((resposta) =>
        resposta.perguntaId === perguntaId
          ? { ...resposta, resposta_opcao: opcaoId }
          : resposta
      )
    );

    // Limpar erros ao selecionar
    if (errors[`pergunta_${perguntaId}`]) {
      const newErrors = { ...errors };
      delete newErrors[`pergunta_${perguntaId}`];
      setErrors(newErrors);
    }
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nome do respondente
    if (!respondentName.trim()) {
      newErrors['respondent_name'] = "Por favor, digite seu nome";
    }

    perguntas.forEach((pergunta) => {
      const resposta = respostas.find((r) => r.perguntaId === pergunta.id);

      if (pergunta.tipo === "resposta_curta") {
        if (!resposta?.resposta_texto?.trim()) {
          newErrors[`pergunta_${pergunta.id}`] = "Esta pergunta é obrigatória";
        }
      } else if (pergunta.tipo === "multipla_escolha") {
        if (!resposta?.resposta_opcao) {
          newErrors[`pergunta_${pergunta.id}`] = "Selecione uma opção";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para incrementar contador de respostas no convite
  const incrementarContadorRespostas = async () => {
    const { error } = await supabase
      .from('convites')
      .update({ respostas_utilizadas: convite.respostas_utilizadas + 1 })
      .eq('id', id);

    if (error) {
      console.error("Erro ao atualizar contador de respostas:", error);
      throw new Error("Erro ao atualizar contador de respostas");
    }
  };

  // Enviar respostas
  const submitRespostas = async () => {
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (limiteRespostasAlcancado) {
      toast.error("Limite de respostas atingido para este convite.");
      return;
    }

    setSubmitting(true);

    try {
      // Determinar o ID do convidado - usar ID do usuário se autenticado, ou gerar um ID anônimo
      const convidadoId = user ? user.id : `anon-${crypto.randomUUID()}`;
      
      // Antes de inserir, verificar se ainda há respostas disponíveis
      if (convite.respostas_utilizadas >= convite.respostas_permitidas) {
        throw new Error("Limite de respostas atingido para este convite");
      }

      // Incrementar o contador de respostas
      await incrementarContadorRespostas();
      
      // Preparar as respostas para inserção
      const respostasParaInserir = respostas.map((resposta) => ({
        pergunta_id: resposta.perguntaId,
        resposta_texto: resposta.resposta_texto || null,
        resposta_opcao: resposta.resposta_opcao || null,
        convidado_id: convidadoId, // Usando ID do usuário ou anônimo
        nome_respondente: respondentName // Mantendo o nome do respondente
      }));

      // Inserir respostas
      const { error: respostasError } = await supabase
        .from("respostas")
        .insert(respostasParaInserir);

      if (respostasError) {
        throw new Error(`Erro ao inserir respostas: ${respostasError.message}`);
      }

      toast.success("Suas respostas foram registradas com sucesso!");
      setFormSubmitted(true);

      // Redirecionar para página de agradecimento após 2 segundos
      setTimeout(() => {
        router.push(`/invite/${id}/response/thanks?name=${encodeURIComponent(respondentName)}`);
      }, 2000);
    } catch (error) {
      // Melhor tratamento de erro
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Erro ao enviar respostas:", errorMessage);
      toast.error(`Ocorreu um erro ao enviar suas respostas: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Music functions
  const toggleMusic = (musicId: string): void => {
    if (formData.musica === musicId) {
      setFormData({
        ...formData,
        musica: null,
      });
      setIsMusicPlaying(false);
    } else {
      setFormData({
        ...formData,
        musica: musicId ?? null, // Garante que seja sempre null ou string
      });
      setIsMusicPlaying(true);
    }
  };

  // Renderizar animações baseadas no tema
  const renderThemeAnimations = () => {
    // Podemos pegar o isDarkMode diretamente do ThemeManager através do theme
    const isDarkMode = currentTheme.textClass.includes("text-rose-200") ||
      currentTheme.textClass.includes("text-indigo-200") ||
      currentTheme.textClass.includes("text-amber-200");

    switch (formData.tema) {
      case "romantico":
        return <HeartAnimation isDark={isDarkMode} />;
      case "elegante":
        return <GlitterAnimation isDark={isDarkMode} />;
      case "divertido":
        return <BalloonAnimation />;
      default:
        return null;
    }
  };

  // Renderizar página de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderizar página de formulário
  return (
    <div className={`min-h-screen ${currentTheme.bgClass} ${currentTheme.textClass} flex flex-col`}>

      {/* Animações baseadas no tema (não mostrar para o tema padrão) */}
      {formData.tema !== "padrao" && renderThemeAnimations()}

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold">Responder Convite</h1>
      </header>


      {/* Music Player (hidden iframe) */}
      {formData.musica && isMusicPlaying && (
        <div style={{ display: "none" }}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${getMusicVideoId(formData.musica)}?autoplay=1&loop=1&playlist=${getMusicVideoId(formData.musica)}`}
            title="YouTube music player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      )}

 
      {/* Content */}
      <div className={`flex-1 p-4 border border-${currentTheme.borderClass} z-10` }>
        {formSubmitted ? (
          <div className={`${currentTheme.cardClass} p-6 rounded-lg text-center transition-all transform scale-100 animate-bounce-once`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Respostas enviadas com sucesso!</h2>
            <p className="mt-1">Obrigado por responder ao convite.</p>
            <p className="mt-2">Redirecionando...</p>

            {formData.tema === "divertido" && <ConfettiExplosion />}
          </div>
        ) : limiteRespostasAlcancado ? (
          <div className={`${currentTheme.cardClass} p-6 rounded-lg text-center transition-all border border-destructive`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Limite de respostas atingido</h2>
            <p className="mt-1">Este convite atingiu o número máximo de respostas permitidas.</p>
            <p className="mt-4">Entre em contato com a pessoa que enviou o convite para mais informações.</p>
            
            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Informações do Convite */}
            <div className={`${currentTheme.cardClass} p-6 rounded-lg shadow-lg mb-6 transition-all  transform hover:scale-[1.01] duration-300 z-50`}>
              <h2 className="text-lg font-semibold mb-4">{convite.titulo}</h2>
              <p className={`${currentTheme.textClass} opacity-80`}>Você foi convidado(a) a responder este formulário.</p>

              {user && (
                <p className="mt-2 text-sm opacity-70">Você está autenticado como {user.email}</p>
              )}

              {/* Informações do plano */}
              <div className="mt-3 text-sm">
                <p>Respostas: {convite.respostas_utilizadas} de {convite.respostas_permitidas} utilizadas</p>
              </div>

              {/* Theme and Music display */}
              {(formData.tema !== "padrao" || formData.musica) && (
                <div className="mt-4 p-2 bg-background/50 rounded-lg text-sm">
                  <p className="font-medium text-center">
                    {formData.tema !== "padrao" && `Tema: ${getThemeById(formData.tema)?.name}`}
                    {formData.tema !== "padrao" && formData.musica && " • "}
                    {formData.musica && `Música: ${getMusicById(formData.musica)?.title}`}
                  </p>
                </div>
              )}
            </div>

            {/* Campo para nome do respondente */}
            <div className={`${currentTheme.cardClass} border ${errors['respondent_name'] ? 'border-destructive' : currentTheme.borderClass
              } rounded-lg p-6 shadow-lg mb-6 transition-all duration-300`}>
              <h3 className={`text-lg font-medium mb-4 ${currentTheme.textClass}`}>
                Qual é o seu nome?
              </h3>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-ring focus:outline-none 
                  bg-background text-foreground
                  ${errors['respondent_name'] ? "border-destructive" : currentTheme.borderClass}`}
                placeholder="Seu nome"
                value={respondentName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
              {errors['respondent_name'] && (
                <p className="mt-2 text-sm text-destructive">
                  {errors['respondent_name']}
                </p>
              )}
            </div>

            {/* Formulário */}
            <div className="space-y-6 ">
              {perguntas.map((pergunta, index) => (
                <div
                  key={pergunta.id}
                  className={`${currentTheme.cardClass} border ${errors[`pergunta_${pergunta.id}`] ? 'border-destructive' : currentTheme.borderClass
                    } rounded-lg p-6 shadow-lg transition-all duration-300 `}
                >
                  <h3 className={`text-lg font-medium mb-4 ${currentTheme.textClass}`}>
                    {index + 1}. {pergunta.texto}
                  </h3>

                  {pergunta.tipo === "resposta_curta" ? (
                    <div>
                      <textarea
                        rows={3}
                        className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-ring focus:outline-none 
                          bg-background text-foreground
                          ${errors[`pergunta_${pergunta.id}`] ? "border-destructive" : currentTheme.borderClass}`}
                        placeholder="Sua resposta"
                        value={respostas.find(r => r.perguntaId === pergunta.id)?.resposta_texto || ""}
                        onChange={(e) => handleTextChange(pergunta.id, e.target.value)}
                      ></textarea>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pergunta.opcoes?.map((opcao) => {
                        const isSelected = respostas.find(r => r.perguntaId === pergunta.id)?.resposta_opcao === opcao.id;
                        return (
                          <label
                            key={opcao.id}
                            className={`flex items-center space-x-3 p-3 
                              bg-background
                              border ${isSelected ? currentTheme.borderClass : "border-input"} 
                              rounded-md cursor-pointer hover:bg-accent transition-colors`}
                          >
                            <input
                              type="radio"
                              name={`pergunta_${pergunta.id}`}
                              checked={isSelected}
                              onChange={() => handleOptionChange(pergunta.id, opcao.id)}
                              className="h-5 w-5 focus:ring-ring border-input"
                            />
                            <span>{opcao.texto}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {errors[`pergunta_${pergunta.id}`] && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors[`pergunta_${pergunta.id}`]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-end mt-8">
                <button
                  onClick={submitRespostas}
                  disabled={submitting}
                  className={`px-6 py-3 ${currentTheme.btnClass} rounded-lg transition-all shadow-lg hover:shadow-xl ${submitting ? "opacity-70 cursor-not-allowed" : `${currentTheme.btnHoverClass} transform hover:-translate-y-1`
                    }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Respostas"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}