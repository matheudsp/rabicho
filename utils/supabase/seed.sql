-- Iniciar uma transação para garantir consistência
BEGIN;

-- Variável para o ID do usuário de exemplo (você pode substituir por um ID real)
DO $$
DECLARE
    user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; -- Substitua pelo ID do usuário real se necessário
    convite_basico_id UUID;
    convite_grupo_id UUID;
    convite_evento_id UUID;
    form_basico_id INT;
    form_grupo_id INT;
    form_evento_id INT;
    pergunta_id INT;
BEGIN

-- 1. CONVITE JANTAR (PLANO BÁSICO)
--------------------------------------
INSERT INTO convites (titulo, criado_por, pago, tema, musica, plano_id, respostas_permitidas, respostas_utilizadas)
VALUES ('Jantar Especial na Casa dos Silva', user_id, TRUE, 'elegante', 'classica', 1, 1, 0)
RETURNING id INTO convite_basico_id;

INSERT INTO formularios (convite_id, nome)
VALUES (convite_basico_id, 'Confirmação para Jantar Especial')
RETURNING id INTO form_basico_id;

-- Pergunta para o Jantar
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_basico_id, 'Você poderá comparecer ao jantar no dia 15/05?', 'multipla_escolha')
RETURNING id INTO pergunta_id;

-- Opções para a pergunta do Jantar
INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, 'Sim, poderei comparecer'),
(pergunta_id, 'Infelizmente não poderei comparecer');


-- 2. CONVITE HALLOWEEN (PLANO GRUPO)
--------------------------------------
INSERT INTO convites (titulo, criado_por, pago, tema, musica, plano_id, respostas_permitidas, respostas_utilizadas)
VALUES ('Noite de Halloween Assustadora', user_id, TRUE, 'divertido', 'thriller', 2, 10, 0)
RETURNING id INTO convite_grupo_id;

INSERT INTO formularios (convite_id, nome)
VALUES (convite_grupo_id, 'Confirmação para Festa de Halloween')
RETURNING id INTO form_grupo_id;

-- Pergunta 1: Fantasia
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_grupo_id, 'Você virá fantasiado para nossa festa?', 'multipla_escolha')
RETURNING id INTO pergunta_id;

INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, 'Sim, já tenho minha fantasia'),
(pergunta_id, 'Sim, mas ainda não decidi a fantasia'),
(pergunta_id, 'Não, irei sem fantasia');

-- Pergunta 2: Petiscos
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_grupo_id, 'Qual petisco você prefere em uma festa de Halloween?', 'multipla_escolha')
RETURNING id INTO pergunta_id;

INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, 'Doces e guloseimas'),
(pergunta_id, 'Salgadinhos'),
(pergunta_id, 'Comidas temáticas assustadoras'),
(pergunta_id, 'Tanto faz, gosto de tudo');

-- Pergunta 3: Alergias
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_grupo_id, 'Você tem alguma alergia alimentar que devemos considerar?', 'resposta_curta');


-- 3. CONVITE CASAMENTO (PLANO EVENTO)
---------------------------------------
INSERT INTO convites (titulo, criado_por, pago, tema, musica, plano_id, respostas_permitidas, respostas_utilizadas)
VALUES ('Casamento de Maria e João', user_id, TRUE, 'romantico', 'elvis', 3, 100, 0)
RETURNING id INTO convite_evento_id;

INSERT INTO formularios (convite_id, nome)
VALUES (convite_evento_id, 'Confirmação para Casamento')
RETURNING id INTO form_evento_id;

-- Pergunta 1: Confirmação de presença
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_evento_id, 'Você comparecerá ao nosso casamento?', 'multipla_escolha')
RETURNING id INTO pergunta_id;

INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, 'Sim, com certeza'),
(pergunta_id, 'Infelizmente não poderei comparecer');

-- Pergunta 2: Número de pessoas
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_evento_id, 'Quantas pessoas virão com você? (incluindo você)', 'multipla_escolha')
RETURNING id INTO pergunta_id;

INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, '1 pessoa'),
(pergunta_id, '2 pessoas'),
(pergunta_id, '3 pessoas'),
(pergunta_id, '4 ou mais pessoas');

-- Pergunta 3: Opção de menu
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_evento_id, 'Opção de menu principal:', 'multipla_escolha')
RETURNING id INTO pergunta_id;

INSERT INTO opcoes (pergunta_id, texto)
VALUES 
(pergunta_id, 'Carne'),
(pergunta_id, 'Peixe'),
(pergunta_id, 'Vegetariano'),
(pergunta_id, 'Vegano');

-- Pergunta 4: Alergias
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_evento_id, 'Você tem alguma alergia ou restrição alimentar?', 'resposta_curta');

-- Pergunta 5: Mensagem
INSERT INTO perguntas (formulario_id, texto, tipo)
VALUES (form_evento_id, 'Você deseja deixar uma mensagem especial para os noivos?', 'resposta_curta');

-- Exibir os IDs criados (opcional, para verificação)
RAISE NOTICE 'Convites criados com IDs: Jantar (%), Halloween (%), Casamento (%)', 
    convite_basico_id, convite_grupo_id, convite_evento_id;

END $$;

-- Confirmar todas as mudanças
COMMIT;