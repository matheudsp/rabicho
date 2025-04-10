CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de Planos
CREATE TABLE planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    quantidade_respostas INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL
);

-- Inserir os planos padrão
INSERT INTO planos (nome, descricao, quantidade_respostas, preco) VALUES
('Convite Básico', '1 convite com direito a 1 resposta', 1, 3.49),
('Convite Grupo', '1 convite com direito a 10 respostas', 10, 9.90),
('Convite Evento', '1 convite com direito a 100 respostas', 100, 19.90);

-- Tabela de Convites (com tema, musica e campos para planos)
CREATE TABLE convites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    criado_por UUID NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pago BOOLEAN DEFAULT FALSE,
    tema VARCHAR(50) DEFAULT 'padrao',
    musica VARCHAR(50) DEFAULT NULL,
    plano_id INT,
    respostas_permitidas INT DEFAULT 0,
    respostas_utilizadas INT DEFAULT 0,
    FOREIGN KEY (plano_id) REFERENCES planos(id)
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

-- Tabela de Respostas (com convidado_id como TEXT e nome_respondente já incluído)
CREATE TABLE respostas (
    id SERIAL PRIMARY KEY,
    pergunta_id INT NOT NULL,
    resposta_texto VARCHAR(255),
    resposta_opcao INT,
    convidado_id TEXT,
    nome_respondente VARCHAR(255),
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE,
    FOREIGN KEY (resposta_opcao) REFERENCES opcoes(id) ON DELETE SET NULL
);


-- Índices para melhorar a performance
CREATE INDEX idx_convite_criado_por ON convites(criado_por);
CREATE INDEX idx_pergunta_formulario ON perguntas(formulario_id);
CREATE INDEX idx_resposta_pergunta ON respostas(pergunta_id);
CREATE INDEX idx_convite_plano ON convites(plano_id);
CREATE INDEX idx_convite_pago ON convites(pago);