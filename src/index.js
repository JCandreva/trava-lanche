export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    switch (pathname) {
      case "/api/produtos":
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
          .bind(nome, parseInt(calorias), parseInt(proteinas), parseInt(gorduras), parseInt(carboidratos))
          .run();
        }
        catch (error) {
          return new Response("Erro ao adicionar produto: " + error.message, { status: 500 });
        }
        return new Response("Produto adicionado com sucesso!");
      }
          
         
      else if (request.method === "GET") {
      const { results } = await env.db
        .prepare("SELECT * FROM produtos")
        .run();
      return Response.json(results);
      }
      break;
    case "/api/produtos/:nome":
      if (request.method === "DELETE") {
        const nome = pathname.split("/").pop();
        await env.db
          .prepare("DELETE FROM produtos WHERE nome = ?")
          .bind(nome)
          .run();
        return new Response("Produto deletado com sucesso!");
      }
      else if (request.method === "GET") {
        const nome = pathname.split("/").pop();
        const { results } = await env.db
          .prepare("SELECT * FROM produtos WHERE nome = ?")
          .bind(nome)
          .run();
        return Response.json(results);
      }
      break;
    case "/api/pessoas":
      if (request.method === "POST") {
        const data = await request.formData();
        const nome = data.get("nome");
        const peso = data.get("peso");
        try{
          await env.db
                    .prepare(
                      "INSERT INTO pessoas (nome, peso) VALUES (?, ?)"
                    )
                    .bind(nome, parseFloat(peso))
                    .run();
                }
        catch (error) {
          return new Response("Erro ao adicionar pessoa: " + error.message, { status: 500 }); 
        }
        return new Response("Pessoa adicionada com sucesso!");
      }
      else if (request.method === "GET") {
        const { results } = await env.db
          .prepare("SELECT * FROM pessoas")
          .run();
        return Response.json(results);
      }
      break;
    case "/api/pessoas/:nome":
      if (request.method === "DELETE") {
        const nome = pathname.split("/").pop();
        await env.db
          .prepare("DELETE FROM pessoas WHERE nome = ?")
          .bind(nome)
          .run();
        return new Response("Pessoa deletada com sucesso!");
      }
      else if (request.method === "GET") {
        const nome = pathname.split("/").pop();
        const { results } = await env.db
          .prepare("SELECT * FROM pessoas WHERE nome = ?")
          .bind(nome)
          .run();
        return Response.json(results);
      }
      break;
  }


    return new Response(
      "Call /api/produtos to see all products",
    );
  },
};