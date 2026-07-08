script 1:
```sql
CREATE TABLE pessoas(
  nome varchar primary key unique,
  peso float
, "idade" INTEGER, "altura" INTEGER);
CREATE TABLE produtos (
    nome VARCHAR PRIMARY KEY UNIQUE,
  	calorias FLOAT,
  	proteinas FLOAT,
  	gorduras 	FLOAT,
  	carboidratos	FLOAT
		
);
CREATE TABLE alimentacao(
  id_alimentacao INTEGER primary key autoincrement,
  nome_produto INTEGER references produtos(nome) on delete cascade on update cascade,
  nome_pessoa INTEGER references pessoas(nome) on delete cascade on update cascade,
  data_hora datetime,
  quantidade float
);
```

script 2:
```sql
INSERT INTO pessoas ("nome", "peso", "idade", "altura") 
VALUES('João', 75, 75, 175),
('Ana', 52, 20, 160),
('Fábio', 100, 21, 170),
('Caio', 80, 16, 190),
('Fael', 48, 12, 150);
INSERT INTO produtos ("nome", "calorias", "proteinas", "gorduras", "carboidratos") 
VALUES('Arroz', 128, 2, 0, 1),
('Frango', 163, 31, 3, 1),
('Pão de forma', 125, 4, 1.5, 24),
('Alcatra(1 bife médio)', 241, 31.9, 11.6, 0),
('Feijão', 70, 4.5, 14, 0.5);
INSERT INTO alimentacao ("nome_produto", "nome_pessoa", "data_hora", "quantidade")
VALUES('Arroz', 'João', '2026-07-08T14:49', 1),
('Arroz', 'Ana', '2026-07-08T14:49', 1),
('Arroz', 'Fábio', '2026-07-08T14:49', 1),
('Arroz', 'Caio', '2026-07-08T14:49', 1),
('Arroz', 'Fael', '2026-07-08T14:49', 1);
```

script 3:
```sql
DELETE FROM produtos;
DELETE FROM pessoas;
DELETE FROM alimentacao;
```

script 4:
```sql
SELECT
p.nome AS nome_pessoa,
SUM(pr.calorias * a.quantidade) AS total_calorias,
SUM(pr.proteinas * a.quantidade) AS total_proteinas,
SUM(pr.gorduras * a.quantidade) AS total_gorduras,
SUM(pr.carboidratos * a.quantidade) AS total_carboidratos
FROM alimentacao a
JOIN produtos pr ON a.nome_produto = pr.nome
JOIN pessoas p ON a.nome_pessoa = p.nome
WHERE p.nome = 'Ana' AND a.data_hora LIKE '2026-07-08%'
GROUP BY p.nome;
```

script 5:
```sql
SELECT * FROM pessoas
WHERE idade > ALL(SELECT DISTINCT idade FROM pessoas);
```

script 6:
```sql
SELECT * FROM pessoas p
WHERE EXISTS(SELECT 1 FROM alimentacao a WHERE a.nome_pessoa = p.nome);
```
