CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de Convites (com tema e musica já incorporados, e nome_destinatario renomeado para titulo)
CREATE TABLE convites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    criado_por UUID NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pago BOOLEAN DEFAULT FALSE,
    tema VARCHAR(50) DEFAULT 'padrao',
    musica VARCHAR(50) DEFAULT NULL
);

-- Tabela de Formulários
CREATE TABLE formularios (
    id SERIAL PRIMARY KEY,
    convite_id UUID NOT NULL,
    nome VARCHAR(255) NOT NULL,
    FOREIGN KEY (convite_id) REFERENCES convites(id) ON DELETE CASCADE
);

-- Tabela de Perguntas
CREATE TABLE perguntas (
    id SERIAL PRIMARY KEY,
    formulario_id INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN ('resposta_curta', 'multipla_escolha')),
    FOREIGN KEY (formulario_id) REFERENCES formularios(id) ON DELETE CASCADE
);

-- Tabela de Opções (para perguntas de múltipla escolha)
CREATE TABLE opcoes (
    id SERIAL PRIMARY KEY,
    pergunta_id INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE
);

-- Tabela de Respostas (com convidado_id como UUID e nome_respondente já incluído)
CREATE TABLE respostas (
    id SERIAL PRIMARY KEY,
    pergunta_id INT NOT NULL,
    resposta_texto VARCHAR(255),
    resposta_opcao INT,
    convidado_id UUID NOT NULL,
    nome_respondente VARCHAR(255),
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE,
    FOREIGN KEY (resposta_opcao) REFERENCES opcoes(id) ON DELETE SET NULL
);

-- Índices para melhorar a performance
CREATE INDEX idx_convite_criado_por ON convites(criado_por);
CREATE INDEX idx_pergunta_formulario ON perguntas(formulario_id);
CREATE INDEX idx_resposta_pergunta ON respostas(pergunta_id);