"use client";

import { useState } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PlusIcon, Music, Palette } from "lucide-react";

import { BalloonAnimation, GlitterAnimation, HeartAnimation } from "@/components/themes/themesAnimations";
import { useThemeManager } from "@/components/themes/themeManager";

interface PerguntaOption {
  id?: number;
  texto: string;
  tipo: "resposta_curta" | "multipla_escolha";
  opcoes?: string[];
}

interface FormErrors {
  tituloConvite?: string;
  novaPergunta?: string;
  novaOpcao?: string;
  formulario?: string;
}

interface FormDataType {
  tituloConvite: string;
  tema: string;
  musicaUrl: string;
}

export default function CreateInvite() {
  const router = useRouter();
  const supabase = createClient();

  // Usando o ThemeManager
  const { themeOptions, musicOptions, getThemeById, getMusicById } = useThemeManager();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    tituloConvite: "",
    tema: "padrao",
    musicaUrl: ""
  });
  const [perguntas, setPerguntas] = useState<PerguntaOption[]>([]);
  const [novaPergunta, setNovaPergunta] = useState<PerguntaOption>({
    texto: "",
    tipo: "resposta_curta",
    opcoes: [],
  });
  const [novaOpcao, setNovaOpcao] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPerguntaModalOpen, setIsPerguntaModalOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // Get current theme
  const currentTheme = getThemeById(formData.tema) || themeOptions[0];

  // Função para extrair o ID do vídeo de uma URL do YouTube
  // Função para extrair o ID do vídeo de uma URL do YouTube
  const getMusicVideoId = (url: string): string | null => {
    if (!url) return null;

    // Padrão para URLs como https://www.youtube.com/watch?v=VIDEO_ID
    const watchRegex = /youtube\.com\/watch\?v=([^&]+)/;
    const watchMatch = url.match(watchRegex);

    // Padrão para URLs encurtadas como https://youtu.be/VIDEO_ID
    const shortRegex = /youtu\.be\/([^?&]+)/;
    const shortMatch = url.match(shortRegex);

    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    } else if (shortMatch && shortMatch[1]) {
      return shortMatch[1];
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tituloConvite) {
      newErrors.tituloConvite = "Título do convite é obrigatório";
    }

    if (perguntas.length === 0) {
      newErrors.formulario = "Adicione pelo menos uma pergunta ao formulário";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOpcao = (): void => {
    if (!novaOpcao.trim()) {
      setErrors({
        ...errors,
        novaOpcao: "A opção não pode estar vazia"
      });
      return;
    }

    setNovaPergunta({
      ...novaPergunta,
      opcoes: [...(novaPergunta.opcoes || []), novaOpcao.trim()],
    });
    setNovaOpcao("");
    setErrors({
      ...errors,
      novaOpcao: undefined,
    });
  };

  const handleTipoChange = (tipo: "resposta_curta" | "multipla_escolha"): void => {
    setNovaPergunta({
      ...novaPergunta,
      tipo,
      opcoes: tipo === "resposta_curta" ? [] : novaPergunta.opcoes,
    });
  };

  const addPergunta = (): void => {
    if (!novaPergunta.texto.trim()) {
      setErrors({
        ...errors,
        novaPergunta: "O texto da pergunta não pode estar vazio"
      });
      return;
    }

    if (novaPergunta.tipo === "multipla_escolha" &&
      (!novaPergunta.opcoes || novaPergunta.opcoes.length < 2)) {
      setErrors({
        ...errors,
        novaPergunta: "Adicione pelo menos duas opções para perguntas de múltipla escolha"
      });
      return;
    }

    setPerguntas([...perguntas, { ...novaPergunta }]);
    setNovaPergunta({
      texto: "",
      tipo: "resposta_curta",
      opcoes: [],
    });
    setErrors({
      ...errors,
      novaPergunta: undefined,
      formulario: undefined,
    });
    setIsPerguntaModalOpen(false);
  };

  const editPergunta = (index: number): void => {
    setNovaPergunta(perguntas[index]);
    removePergunta(index);
    setIsPerguntaModalOpen(true);
  };

  const removePergunta = (index: number): void => {
    const novasPerguntas = [...perguntas];
    novasPerguntas.splice(index, 1);
    setPerguntas(novasPerguntas);
  };

  const removeOpcao = (index: number): void => {
    const novasOpcoes = [...(novaPergunta.opcoes || [])];
    novasOpcoes.splice(index, 1);
    setNovaPergunta({
      ...novaPergunta,
      opcoes: novasOpcoes,
    });
  };

  const nextStep = (): void => {
    if (currentStep === 1) {
      if (!formData.tituloConvite) {
        validate();
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = (): void => {
    setCurrentStep(currentStep - 1);
  };

  // Theme functions
  const changeTheme = (themeId: string): void => {
    setFormData({
      ...formData,
      tema: themeId,
    });
  };

  // Music functions
  // Music functions
  const toggleMusic = (): void => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) {
      toast.error("Por favor, corrija os erros do formulário");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Você precisa estar logado para criar um convite");
        return;
      }

      const { data: convite, error } = await supabase
        .from("convites")
        .insert([{
          titulo: formData.tituloConvite,
          tema: formData.tema,
          musica: formData.musicaUrl, // Agora salvamos a URL completa
          criado_por: user.id,
          pago: false,
        }])
        .select("id");
      if (error) {
        throw new Error(`Erro ao criar convite: ${error.message}`);
      }

      const conviteId = convite[0].id;

      const { data: formulario, error: formError } = await supabase
        .from("formularios")
        .insert([{ convite_id: conviteId, nome: `Formulário para ${formData.tituloConvite}` }])
        .select("id");

      if (formError) {
        throw new Error(`Erro ao criar formulário: ${formError.message}`);
      }

      const formularioId = formulario[0].id;

      for (const pergunta of perguntas) {
        const { data: perguntaData, error: perguntaError } = await supabase
          .from("perguntas")
          .insert([{ formulario_id: formularioId, texto: pergunta.texto, tipo: pergunta.tipo }])
          .select("id");

        if (perguntaError) {
          throw new Error(`Erro ao criar pergunta: ${perguntaError.message}`);
        }

        const perguntaId = perguntaData[0].id;

        if (pergunta.tipo === "multipla_escolha" && pergunta.opcoes && pergunta.opcoes.length > 0) {
          const opcoesParaInserir = pergunta.opcoes.map(opcao => ({
            pergunta_id: perguntaId,
            texto: opcao
          }));

          const { error: opcoesError } = await supabase
            .from("opcoes")
            .insert(opcoesParaInserir);

          if (opcoesError) {
            throw new Error(`Erro ao criar opções: ${opcoesError.message}`);
          }
        }
      }

      toast.success("Convite criado com sucesso!");
      router.push(`/invite/${conviteId}/payment`);

    } catch (error) {
      console.error("Erro:", error);
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro ao criar o convite");
    } finally {
      setIsLoading(false);
    }
  };

 
  const renderThemeAnimations = () => {
    
    switch (formData.tema) {
      case "romantico":
        return <HeartAnimation isDark={currentTheme.textClass.includes("text-rose-200")} />;
      case "elegante":
        return <GlitterAnimation isDark={currentTheme.textClass.includes("text-indigo-200")} />;
      case "divertido":
        return <BalloonAnimation />;
      default:
        return null;
    }
  };

  return (
    <div className={`mx-auto ${currentTheme.bgClass} ${currentTheme.textClass} min-h-[75vh] flex flex-col`}>
      
      {/* Theme animations */}
      {renderThemeAnimations()}

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold">Criar Convite</h1>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className={`h-1 w-12 rounded ${currentStep >= 1 ? 'bg-primary-foreground' : 'bg-primary-foreground/50'}`}></div>
            <div className={`h-1 w-12 rounded ${currentStep >= 2 ? 'bg-primary-foreground' : 'bg-primary-foreground/50'}`}></div>
            <div className={`h-1 w-12 rounded ${currentStep >= 3 ? 'bg-primary-foreground' : 'bg-primary-foreground/50'}`}></div>
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      {isThemeSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-card-foreground">Personalização do Convite</h3>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme selection */}
              <div>
                <h3 className="text-primary font-medium mb-3 flex items-center">
                  <Palette size={18} className="mr-2" />
                  Escolha um tema:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => changeTheme(theme.id)}
                      className={`p-3 rounded-lg transition-all ${formData.tema === theme.id
                        ? `${theme.bgClass} border-2 ${theme.borderClass} ${theme.textClass} transform scale-105`
                        : `bg-secondary text-secondary-foreground hover:bg-secondary/80`
                        }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music selection */}
              {/* Music URL input */}
              <div>
                <h3 className="text-primary font-medium mb-3 flex items-center">
                  <Music size={18} className="mr-2" />
                  Música de fundo (YouTube):
                </h3>
                <div className="space-y-2">
                  <input
                    type="url"
                    name="musicaUrl"
                    value={formData.musicaUrl}
                    onChange={handleInputChange}
                    placeholder="Cola aqui a URL do YouTube (ex: https://www.youtube.com/watch?v=...)"
                    className="w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none border-input"
                  />
                  {formData.musicaUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate flex-1 mr-2">
                        {formData.musicaUrl}
                      </span>
                      <button
                        onClick={() => toggleMusic()}
                        className={`px-3 py-1 rounded-lg transition-all border border-border ${isMusicPlaying
                          ? `border border-border`
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                      >
                        {isMusicPlaying ? "Pausar" : "Tocar"}
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    A música será tocada quando o convidado abrir o convite.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsThemeSelectorOpen(false)}
                className={`px-4 py-2 ${currentTheme.btnClass} rounded-lg ${currentTheme.btnHoverClass}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Player (hidden iframe) */}
      {formData.musicaUrl && isMusicPlaying && (
        <div style={{ display: "none" }}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${getMusicVideoId(formData.musicaUrl)}?autoplay=1&loop=1&playlist=${getMusicVideoId(formData.musicaUrl)}`}
            title="YouTube music player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 p-4 border border-${currentTheme.borderClass}`}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className={`${currentTheme.cardClass} p-4 rounded-lg shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4 text-foreground">Informações Básicas</h2>

              <div className="mb-4">
                <label htmlFor="tituloConvite" className="block text-sm font-medium text-foreground mb-1">
                  Título do Convite
                </label>
                <input
                  id="tituloConvite"
                  name="tituloConvite"
                  type="text"
                  value={formData.tituloConvite}
                  onChange={handleInputChange}
                  placeholder="Digite o título do convite"
                  className={`w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-ring outline-none ${errors.tituloConvite ? "border-destructive" : "border-input"
                    }`}
                />
                {errors.tituloConvite && (
                  <p className="mt-1 text-sm text-destructive">{errors.tituloConvite}</p>
                )}
              </div>

              {/* Theme and Music Button */}
              <div className="mt-6">
                <button
                  onClick={() => setIsThemeSelectorOpen(true)}
                  className={`w-full p-3 ${currentTheme.btnClass} ${currentTheme.btnHoverClass} rounded-lg flex items-center justify-center space-x-2`}
                >
                  <Palette size={18} />
                  <span>Personalizar Tema e Música</span>
                  {formData.tema !== "padrao" && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full ml-2">
                      {getThemeById(formData.tema)?.name}
                    </span>
                  )}
                </button>
                {(formData.tema !== "padrao" || formData.musicaUrl) && (
                  <div className="mt-2 p-2 bg-background/50 rounded-lg text-sm">
                    <p className="font-medium text-center">
                      {formData.tema !== "padrao" && `Tema: ${getThemeById(formData.tema)?.name}`}
                      {formData.tema !== "padrao" && formData.musicaUrl && " • "}
                      {formData.musicaUrl && "Música: "+formData.musicaUrl }
                    </p>
                  </div>
                )}
               
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className={`${currentTheme.cardClass} p-4 rounded-lg shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">Perguntas do Formulário</h2>
                <button
                  onClick={() => setIsPerguntaModalOpen(true)}
                  className="bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {errors.formulario && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">{errors.formulario}</p>
                </div>
              )}

              {perguntas.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Nenhuma pergunta adicionada</p>
                  <p className="text-sm mt-2">Toque no botão + para adicionar perguntas</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {perguntas.map((pergunta, index) => (
                    <li
                      key={index}
                      className={`${currentTheme.cardClass} p-4 rounded-lg border-l-4 border-primary shadow-sm`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">{pergunta.texto}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pergunta.tipo === "resposta_curta"
                              ? "Resposta Curta"
                              : "Múltipla Escolha"}
                          </p>

                          {pergunta.tipo === "multipla_escolha" && pergunta.opcoes && (
                            <ul className="mt-2 pl-4">
                              {pergunta.opcoes.map((opcao, i) => (
                                <li key={i} className="text-sm text-card-foreground">• {opcao}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => editPergunta(index)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label="Editar pergunta"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removePergunta(index)}
                            className="text-destructive hover:text-destructive/70"
                            aria-label="Remover pergunta"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className={`${currentTheme.cardClass} p-4 rounded-lg shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4 text-foreground">Resumo do Convite</h2>

              <div className={`${currentTheme.cardClass} p-4 rounded-lg border ${currentTheme.borderClass} mb-4`}>
                <h3 className="font-medium text-card-foreground">Informações Básicas</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Título:</span>
                    <span className="font-medium">{formData.tituloConvite}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tema:</span>
                    <span className="font-medium">{getThemeById(formData.tema)?.name || "Padrão"}</span>
                  </div>
                  
                </div>
              </div>

              <div className={`${currentTheme.cardClass} p-4 rounded-lg border ${currentTheme.borderClass}`}>
                <h3 className="font-medium text-card-foreground">Perguntas ({perguntas.length})</h3>
                <ul className="mt-2 space-y-3">
                  {perguntas.map((pergunta, index) => (
                    <li key={index} className="border-b border-border pb-2">
                      <p className="text-sm font-medium">{index + 1}. {pergunta.texto}</p>
                      <p className="text-xs text-muted-foreground">
                        {pergunta.tipo === "resposta_curta" ? "Resposta Curta" : "Múltipla Escolha"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar pergunta */}
      {isPerguntaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-card-foreground">Nova Pergunta</h3>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="perguntaTexto" className="block text-sm font-medium text-card-foreground mb-1">
                  Texto da Pergunta
                </label>
                <input
                  id="perguntaTexto"
                  type="text"
                  value={novaPergunta.texto}
                  onChange={(e) => setNovaPergunta({ ...novaPergunta, texto: e.target.value })}
                  placeholder="Ex: Qual sua preferência de comida?"
                  className="w-full p-3 border border-input bg-background rounded-lg"
                />
                {errors.novaPergunta && (
                  <p className="mt-1 text-sm text-destructive">{errors.novaPergunta}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Tipo de Resposta
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleTipoChange("resposta_curta")}
                    className={`flex-1 py-2 px-4 border rounded-lg ${novaPergunta.tipo === "resposta_curta"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-input text-card-foreground"
                      }`}
                  >
                    Resposta Curta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTipoChange("multipla_escolha")}
                    className={`flex-1 py-2 px-4 border rounded-lg ${novaPergunta.tipo === "multipla_escolha"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-input text-card-foreground"
                      }`}
                  >
                    Múltipla Escolha
                  </button>
                </div>
              </div>

              {novaPergunta.tipo === "multipla_escolha" && (
                <div className="bg-muted p-3 rounded-lg">
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Opções de Resposta
                  </label>

                  <div className="flex mb-2 w-full">
                    <input
                      type="text"
                      value={novaOpcao}
                      onChange={(e) => setNovaOpcao(e.target.value)}
                      placeholder="Nova opção"
                      className="flex-1 p-2 border border-input bg-background rounded-lg w-8/12 mr-2"
                    />
                    <button
                      onClick={addOpcao}
                      type="button"
                      className="bg-blue-500 flex items-center justify-center hover:bg-blue-600 text-white px-3 py-2 rounded-lg w-3/12"
                    >
                      <PlusIcon size={24} />
                    </button>
                  </div>

                  {errors.novaOpcao && (
                    <p className="mb-2 text-sm text-destructive">{errors.novaOpcao}</p>
                  )}
                  {novaPergunta.opcoes && novaPergunta.opcoes.length > 0 && (
                    <ul className="mt-3 bg-card rounded-lg border border-border divide-y divide-border">
                      {novaPergunta.opcoes.map((opcao, index) => (
                        <li key={index} className="flex items-center justify-between p-3">
                          <span className="text-sm">{opcao}</span>
                          <button
                            onClick={() => removeOpcao(index)}
                            className="text-destructive"
                            aria-label="Remover opção"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end space-x-2">
              <button
                onClick={() => setIsPerguntaModalOpen(false)}
                className="px-4 py-2 border border-input rounded-lg text-foreground hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                onClick={addPergunta}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Salvar Pergunta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Action Buttons */}
      <footer className="bg-background border-x border-border p-4 sticky bottom-0">
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-input rounded-lg text-foreground hover:bg-accent"
            >
              Voltar
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-3 bg-primary text-primary-foreground rounded-lg ${isLoading ? "opacity-70" : "hover:bg-primary/90"
                }`}
            >
              {isLoading ? "Enviando..." : "Criar Convite"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

