export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    async function ensureForeignKeyParentKeys() {
      await env.db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pessoas_nome ON pessoas(nome)").run();
      await env.db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome)").run();
    }

    if (pathname === "/api/produtos") {
      if (request.method === "POST") {
        const data = await request.formData();
        const nome = data.get("nome");
        const calorias = data.get("calorias");
        const proteinas = data.get("proteinas");
        const gorduras = data.get("gorduras");
        const carboidratos = data.get("carboidratos");

        try {
          await env.db
            .prepare(
              "INSERT INTO produtos (nome, calorias, proteinas, gorduras, carboidratos) VALUES (?, ?, ?, ?, ?)"
            )
            .bind(
              nome,
              parseInt(calorias),
              parseInt(proteinas),
              parseInt(gorduras),
              parseInt(carboidratos)
            )
            .run();
        } catch (error) {
          return new Response("Erro ao adicionar produto: " + error.message, { status: 500 });
        }

        return new Response("Produto adicionado com sucesso!");
      }

      if (request.method === "GET") {
        const { results } = await env.db.prepare("SELECT * FROM produtos").run();
        return Response.json(results);
      }
    }

    if (pathname.startsWith("/api/produtos/")) {
      const nome = decodeURIComponent(pathname.split("/").pop());

      if (request.method === "DELETE") {
        await env.db
          .prepare("DELETE FROM produtos WHERE nome = ?")
          .bind(nome)
          .run();
        return new Response("Produto deletado com sucesso!");
      }

      if (request.method === "GET") {
        const { results } = await env.db
          .prepare("SELECT * FROM produtos WHERE nome LIKE ?")
          .bind(`%${nome}%`)
          .run();
        return Response.json(results);
      }
    }

    if (pathname === "/api/pessoas") {
      if (request.method === "POST") {
        const data = await request.formData();
        const nome = data.get("nome");
        const peso = data.get("peso");

        try {
          await env.db
            .prepare("INSERT INTO pessoas (nome, peso) VALUES (?, ?)")
            .bind(nome, parseFloat(peso))
            .run();
        } catch (error) {
          return new Response("Erro ao adicionar pessoa: " + error.message, { status: 500 });
        }

        return new Response("Pessoa adicionada com sucesso!");
      }

      if (request.method === "GET") {
        const { results } = await env.db.prepare("SELECT * FROM pessoas").run();
        return Response.json(results);
      }
    }

    if (pathname.startsWith("/api/pessoas/")) {
      const nome = decodeURIComponent(pathname.split("/").pop());

      if (request.method === "DELETE") {
        await env.db
          .prepare("DELETE FROM pessoas WHERE nome = ?")
          .bind(nome)
          .run();
        return new Response("Pessoa deletada com sucesso!");
      }

      if (request.method === "GET") {
        const { results } = await env.db
          .prepare("SELECT * FROM pessoas WHERE nome = ?")
          .bind(nome)
          .run();
        return Response.json(results);
      }
    }

    if (pathname === "/api/alimentacoes") {
      if (request.method === "POST") {
        const data = await request.formData();
        const nome_pessoa = data.get("nome_pessoa");
        const nome_produto = data.get("nome_produto");
        const quantidade = data.get("quantidade");
        const data_hora = data.get("data_hora");

        try {
          await env.db
            .prepare("INSERT INTO alimentacao (nome_produto, nome_pessoa, quantidade, data_hora) VALUES (?, ?, ?, ?)")
            .bind(nome_produto, nome_pessoa, parseInt(quantidade), data_hora)
            .run();
        } catch (error) {
          return new Response("Erro ao adicionar alimentação: " + error.message, { status: 500 });
        }

        return new Response("Alimentação adicionada com sucesso!");
      }

      if (request.method === "GET") {
        const { results } = await env.db.prepare("SELECT * FROM alimentacao").run();
        return Response.json(results);
      }
    }

    if (pathname.startsWith("/api/consulta_macros")) {
      if (request.method === "GET") {
        const data = new URL(request.url).searchParams;
        const nome_pessoa = data.get("nome_pessoa");
        const dia = data.get("data");
        const { results } = await env.db
          .prepare(`
            SELECT 
              p.nome AS nome_pessoa,
              SUM(pr.calorias * a.quantidade) AS total_calorias,
              SUM(pr.proteinas * a.quantidade) AS total_proteinas,
              SUM(pr.gorduras * a.quantidade) AS total_gorduras,
              SUM(pr.carboidratos * a.quantidade) AS total_carboidratos
            FROM alimentacao a
            JOIN produtos pr ON a.nome_produto = pr.nome
            JOIN pessoas p ON a.nome_pessoa = p.nome
            WHERE p.nome = ? AND a.data_hora LIKE ?
            GROUP BY p.nome
          `)
          .bind(nome_pessoa, `${dia}%`)
          .run();

        return Response.json(results);
      }
    }

    return new Response(
      "Call /api/produtos to see all products",
    );
  },
};