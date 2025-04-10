"use client";

import { useState, useEffect, use } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { DownloadIcon, ChevronLeft, BarChart2, FileText, Search, User, Users, Filter } from "lucide-react";

import { BalloonAnimation, GlitterAnimation, HeartAnimation } from "@/components/themes/themesAnimations";
import { useThemeManager } from "@/components/themes/themeManager";
import ShareModal from "@/components/shareModal";

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
  id: number;
  pergunta_id: number;
  resposta_texto?: string;
  resposta_opcao?: number;
  convidado_id: string;
  opcao_texto?: string;
  nome_respondente?: string; // Adicionado campo para o nome do respondente
}

interface RespostaAgrupada {
  convidado_id: string;
  nome_respondente: string; // Adicionado campo para o nome do respondente
  respostas: Resposta[];
}

export default function VerRespostas({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  // Usando o ThemeManager
  const { themeOptions, getThemeById } = useThemeManager();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [convite, setConvite] = useState<any>(null);
  const [formulario, setFormulario] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostasAgrupadas, setRespostasAgrupadas] = useState<RespostaAgrupada[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'resumo'>('individual');
  const [currentResposta, setCurrentResposta] = useState<number>(0);
  
  // Estados para filtro de respondentes
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedRespondente, setSelectedRespondente] = useState<string>('todos');
  const [filteredRespostas, setFilteredRespostas] = useState<RespostaAgrupada[]>([]);
  const [respondentes, setRespondentes] = useState<{id: string, nome: string}[]>([]);

  // Estado para tema
  const [formData, setFormData] = useState({
    tema: "padrao"
  });

  // Get current theme
  const currentTheme = getThemeById(formData.tema) || themeOptions[0];

  // Aplicar filtros às respostas
  useEffect(() => {
    if (selectedRespondente === 'todos') {
      setFilteredRespostas(respostasAgrupadas);
    } else {
      setFilteredRespostas(respostasAgrupadas.filter(r => r.convidado_id === selectedRespondente));
    }
    // Resetar o índice da resposta atual quando mudar o filtro
    setCurrentResposta(0);
  }, [selectedRespondente, respostasAgrupadas]);

  // Buscar dados do convite, formulário e respostas
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

        setConvite(conviteData);

        // Aplicar tema do convite
        if (conviteData.tema) {
          setFormData(prev => ({ ...prev, tema: conviteData.tema }));
        }

        // Buscar formulário
        const { data: formularioData, error: formularioError } = await supabase
          .from("formularios")
          .select("*")
          .eq("convite_id", conviteData.id)
          .single();

        if (formularioError) throw formularioError;
        setFormulario(formularioData);

        // Buscar perguntas com opções
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

        // Buscar respostas incluindo nome_respondente
        const { data: respostasData, error: respostasError } = await supabase
          .from("respostas")
          .select(`
            id,
            pergunta_id,
            resposta_texto,
            resposta_opcao,
            convidado_id,
            nome_respondente
          `)
          .in("pergunta_id", perguntasData.map(p => p.id));

        if (respostasError) throw respostasError;

        // Buscar os textos das opções para as respostas de múltipla escolha
        const respostasComOpcoes = await Promise.all(
          respostasData.map(async (resposta) => {
            if (resposta.resposta_opcao) {
              const { data: opcaoData, error: opcaoError } = await supabase
                .from("opcoes")
                .select("texto")
                .eq("id", resposta.resposta_opcao)
                .single();

              if (!opcaoError && opcaoData) {
                return { ...resposta, opcao_texto: opcaoData.texto };
              }
            }
            return resposta;
          })
        );

        // Agrupar respostas por convidado e incluir nome_respondente
        const respostasAgrupadas: RespostaAgrupada[] = [];
        const respondentesList: {id: string, nome: string}[] = [];
        
        respostasComOpcoes.forEach(resposta => {
          const index = respostasAgrupadas.findIndex(r => r.convidado_id === resposta.convidado_id);
          
          // Usar nome_respondente ou "Anônimo" se não estiver disponível
          const nomeRespondente = resposta.nome_respondente || "Anônimo";
          
          if (index === -1) {
            respostasAgrupadas.push({
              convidado_id: resposta.convidado_id,
              nome_respondente: nomeRespondente,
              respostas: [resposta]
            });
            
            // Adicionar à lista de respondentes para o filtro
            if (!respondentesList.some(r => r.id === resposta.convidado_id)) {
              respondentesList.push({
                id: resposta.convidado_id,
                nome: nomeRespondente
              });
            }
          } else {
            respostasAgrupadas[index].respostas.push(resposta);
          }
        });

        setRespondentes(respondentesList);
        setRespostasAgrupadas(respostasAgrupadas);
        setFilteredRespostas(respostasAgrupadas);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar o convite e respostas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, supabase]);

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

  // Exportar respostas para CSV
  const exportToCSV = () => {
    // Preparar cabeçalhos
    const headers = ['Nome do Respondente', 'Convidado ID'];
    perguntas.forEach(pergunta => {
      headers.push(pergunta.texto);
    });

    // Preparar linhas de dados
    const rows = filteredRespostas.map(grupo => {
      const row = [grupo.nome_respondente, grupo.convidado_id];

      perguntas.forEach(pergunta => {
        const resposta = grupo.respostas.find(r => r.pergunta_id === pergunta.id);
        if (resposta) {
          if (resposta.resposta_texto) {
            row.push(resposta.resposta_texto);
          } else if (resposta.opcao_texto) {
            row.push(resposta.opcao_texto);
          } else {
            row.push('');
          }
        } else {
          row.push('');
        }
      });

      return row;
    });

    // Combinar cabeçalhos e linhas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `respostas-convite-${convite.titulo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para renderizar gráficos de resumo (para perguntas de múltipla escolha)
  const renderResumoPergunta = (pergunta: Pergunta) => {
    if (pergunta.tipo === "multipla_escolha" && pergunta.opcoes) {
      // Contar respostas por opção
      const contagemOpcoes: Record<number, number> = {};

      // Inicializar contagem
      pergunta.opcoes.forEach(opcao => {
        contagemOpcoes[opcao.id] = 0;
      });

      // Contar respostas (aplicar filtro se não estiver em "todos")
      filteredRespostas.forEach(grupo => {
        const resposta = grupo.respostas.find(r => r.pergunta_id === pergunta.id);
        if (resposta && resposta.resposta_opcao) {
          contagemOpcoes[resposta.resposta_opcao]++;
        }
      });

      // Calcular percentuais
      const totalRespostas = Object.values(contagemOpcoes).reduce((a, b) => a + b, 0);

      return (
        <div className="space-y-2">
          {pergunta.opcoes.map(opcao => {
            const count = contagemOpcoes[opcao.id] || 0;
            const percent = totalRespostas > 0 ? Math.round((count / totalRespostas) * 100) : 0;

            return (
              <div key={opcao.id} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{opcao.texto}</span>
                  <span className="font-medium">{count} ({percent}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground mt-1">
            Total de respostas: {totalRespostas}
            {selectedRespondente !== 'todos' && ' (filtrado por respondente)'}
          </p>
        </div>
      );
    } else if (pergunta.tipo === "resposta_curta") {
      // Para perguntas de resposta curta, mostrar apenas o número de respostas
      const totalRespostas = filteredRespostas.filter(grupo =>
        grupo.respostas.some(r => r.pergunta_id === pergunta.id && r.resposta_texto)
      ).length;

      return (
        <div>
          <p className="text-sm text-muted-foreground">
            {totalRespostas} respostas recebidas. Veja as respostas individuais na aba "Respostas Individuais".
            {selectedRespondente !== 'todos' && ' (filtrado por respondente)'}
          </p>
        </div>
      );
    }
  };

  // Navegar entre respostas individuais
  const nextResposta = () => {
    if (currentResposta < filteredRespostas.length - 1) {
      setCurrentResposta(currentResposta + 1);
    }
  };

  const prevResposta = () => {
    if (currentResposta > 0) {
      setCurrentResposta(currentResposta - 1);
    }
  };

  // Filtrar respondentes por pesquisa
  const filtrarRespondentes = () => {
    if (!searchTerm) return respondentes;
    
    return respondentes.filter(resp => 
      resp.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  // Renderizar página de visualização de respostas
  return (
    <div className={`min-h-screen ${currentTheme.bgClass} ${currentTheme.textClass} flex flex-col`}>

      {/* Animações baseadas no tema (não mostrar para o tema padrão) */}
      {formData.tema !== "padrao" && renderThemeAnimations()}

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/home')}
              className="p-2 rounded-full hover:bg-primary-foreground/10 mr-2"
              aria-label="Voltar"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Respostas do Convite</h1>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-full ${isFilterOpen ? 'bg-primary-foreground/20' : 'hover:bg-primary-foreground/10'}`}
              aria-label="Filtrar"
            >
              <Filter size={20} />
            </button>
            
            <ShareModal
              itemId={id}
              pathType="see-response"
              buttonText=""
              modalTitle="Compartilhar página de respostas"
              asDropdownItem={false}
            />

            <button
              onClick={exportToCSV}
              className="p-2 rounded-full hover:bg-primary-foreground/10"
              aria-label="Exportar"
            >
              <DownloadIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Filtro de respondentes - aparece quando o botão de filtro é clicado */}
     

      {/* Content */}
      <div className={`flex-1 p-4 border border-${currentTheme.borderClass}`}>

        {/* Informações do Convite */}
        {isFilterOpen && (
        <div className="bg-background ">
          <div className="mb-4">
            <label htmlFor="filter-respondent" className="block text-sm font-medium mb-2">
              Filtrar por respondente
            </label>
            <div className="relative">
              <input
                type="text"
                id="filter-respondent"
                className="w-full p-2 pl-8 rounded-md border border-border bg-background"
                placeholder="Buscar respondente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto mb-2 rounded-md bg-muted p-1">
            <button
              onClick={() => setSelectedRespondente('todos')}
              className={`flex items-center w-full p-2 rounded-md ${
                selectedRespondente === 'todos' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-background'
              }`}
            >
              <Users size={16} className="mr-2" />
              <span>Todos os respondentes</span>
            </button>
            
            {filtrarRespondentes().map((respondente) => (
              <button
                key={respondente.id}
                onClick={() => setSelectedRespondente(respondente.id)}
                className={`flex items-center w-full p-2 rounded-md ${
                  selectedRespondente === respondente.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-background'
                }`}
              >
                <User size={16} className="mr-2" />
                <span>{respondente.nome}</span>
              </button>
            ))}
          </div>
        </div>
      )}
        <div className={`${currentTheme.cardClass} p-6 rounded-lg shadow-lg mb-6 border-border border transition-all transform hover:scale-[1.01] duration-300`}>
          <h2 className="text-lg font-semibold mb-2">{convite.titulo}</h2>
          <div className="flex flex-col justify-center items-start">
            <p className={`${currentTheme.textClass} opacity-80`}>
              {filteredRespostas.length} de {respostasAgrupadas.length} {respostasAgrupadas.length === 1 ? 'resposta' : 'respostas'} 
              {selectedRespondente !== 'todos' ? ' (filtrado)' : ''}
            </p>
            <p className={`text-sm ${currentTheme.textClass} opacity-70`}>
              Criado em {new Date(convite.data_criacao).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'individual'
              ? `border-b-2 ${currentTheme.borderClass} text-primary`
              : 'text-muted-foreground'
              }`}
            onClick={() => setActiveTab('individual')}
          >
            <FileText size={18} className="mr-2" />
            Respostas Individuais
          </button>
          <button
            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'resumo'
              ? `border-b-2 ${currentTheme.borderClass} text-primary`
              : 'text-muted-foreground'
              }`}
            onClick={() => setActiveTab('resumo')}
          >
            <BarChart2 size={18} className="mr-2" />
            Resumo
          </button>
        </div>

        {/* Sem respostas */}
        {filteredRespostas.length === 0 ? (
          <div className={`${currentTheme.cardClass} p-8 rounded-lg text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">
              {respostasAgrupadas.length === 0 ? "Nenhuma resposta ainda" : "Nenhuma resposta encontrada para o filtro aplicado"}
            </h3>
            <p className="text-muted-foreground">
              {respostasAgrupadas.length === 0 
                ? "Quando seus convidados responderem ao convite, as respostas aparecerão aqui." 
                : "Tente ajustar ou remover o filtro para ver outras respostas."}
            </p>
          </div>
        ) : (
          <>
            {/* Tab de Respostas Individuais */}
            {activeTab === 'individual' && (
              <div className="space-y-6">
                {/* Navegação entre respostas */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  {/* Nome do respondente em destaque */}
                  <div className="mb-2 sm:mb-0 order-1 sm:order-2 bg-primary/10 px-4 py-2 rounded-full">
                    <span className="font-medium text-primary">
                      {filteredRespostas[currentResposta]?.nome_respondente || "Anônimo"}
                    </span>
                  </div>
                  
                  <div className="flex items-center order-2 sm:order-1">
                    <button
                      onClick={prevResposta}
                      disabled={currentResposta === 0}
                      className={`p-2 rounded ${currentResposta === 0 ? 'text-muted-foreground' : `text-primary hover:${currentTheme.cardClass}`
                        }`}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <span className="text-sm font-medium mx-2">
                      {currentResposta + 1} de {filteredRespostas.length}
                    </span>

                    <button
                      onClick={nextResposta}
                      disabled={currentResposta === filteredRespostas.length - 1}
                      className={`p-2 rounded ${currentResposta === filteredRespostas.length - 1
                        ? 'text-muted-foreground'
                        : `text-primary hover:${currentTheme.cardClass}`
                        }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Respostas individuais */}
                {filteredRespostas.length > 0 && (
                  <div className={`${currentTheme.cardClass} p-6 rounded-lg shadow-lg`}>
                    <div className="space-y-6">
                      {perguntas.map((pergunta) => {
                        const resposta = filteredRespostas[currentResposta]?.respostas.find(
                          r => r.pergunta_id === pergunta.id
                        );

                        let valorResposta = "Sem resposta";
                        if (resposta) {
                          if (pergunta.tipo === "resposta_curta" && resposta.resposta_texto) {
                            valorResposta = resposta.resposta_texto;
                          } else if (pergunta.tipo === "multipla_escolha" && resposta.opcao_texto) {
                            valorResposta = resposta.opcao_texto;
                          }
                        }

                        return (
                          <div key={pergunta.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                            <h3 className="font-medium mb-2">{pergunta.texto}</h3>
                            <p className={`${valorResposta === "Sem resposta" ? "text-muted-foreground italic" : ""}`}>
                              {valorResposta}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab de Resumo */}
            {activeTab === 'resumo' && (
              <div className="space-y-8">
                {selectedRespondente !== 'todos' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4">
                    <p className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Mostrando resumo apenas das respostas de: <strong className="ml-1">{respondentes.find(r => r.id === selectedRespondente)?.nome || "Anônimo"}</strong>
                    </p>
                  </div>
                )}
                
                {perguntas.map((pergunta) => (
                  <div key={pergunta.id} className={`${currentTheme.cardClass} p-6 rounded-lg shadow-lg`}>
                    <h3 className="font-medium mb-4">{pergunta.texto}</h3>
                    {renderResumoPergunta(pergunta)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}