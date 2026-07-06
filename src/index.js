export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    switch (pathname) {
      case "/api/produtos":
        if (request.method === "POST") {
          const data = await request.formData();
          const { nome, calorias, proteinas, gorduras, carobidratos } = data;
          await env.db
            .prepare(
            "INSERT INTO produtos (nome, calorias, proteinas, gorduras, carobidratos) VALUES (?, ?, ?, ?, ?)"
          )
          .bind(nome, parseInt(calorias), parseInt(proteinas), parseInt(gorduras), parseInt(carobidratos))
          .run();
        return new Response("Produto adicionado com sucesso!");
      }
      else if (request.method === "GET") {
      const { results } = await env.db
        .prepare("SELECT * FROM produtos")
        .run();
      return Response.json(results);
      }
      break;
    case "/api/produtos/:id":
      if (request.method === "DELETE") {
        const id = pathname.split("/").pop();
        await env.db
          .prepare("DELETE FROM produtos WHERE id = ?")
          .bind(id)
          .run();
        return new Response("Produto deletado com sucesso!");
      }
      else if (request.method === "GET") {
        const id = pathname.split("/").pop();
        const { results } = await env.db
          .prepare("SELECT * FROM produtos WHERE id = ?")
          .bind(id)
          .run();
        return Response.json(results);
      }
      break;
    case "/api/pessoas":
      if (request.method === "POST") {
        const data = await request.formData();
        const { nome, idade, peso, altura } = data;
        await env.db
          .prepare(
            "INSERT INTO pessoas (nome, idade, peso, altura) VALUES (?, ?, ?, ?)"
          )
          .bind(nome, parseInt(idade), parseFloat(peso), parseFloat(altura))
          .run();
        return new Response("Pessoa adicionada com sucesso!");
      }
      else if (request.method === "GET") {
        const { results } = await env.db
          .prepare("SELECT * FROM pessoas")
          .run();
        return Response.json(results);
      }
      break;
    case "/api/pessoas/:id":
      if (request.method === "DELETE") {
        const id = pathname.split("/").pop();
        await env.db
          .prepare("DELETE FROM pessoas WHERE id = ?")
          .bind(id)
          .run();
        return new Response("Pessoa deletada com sucesso!");
      }
      else if (request.method === "GET") {
        const id = pathname.split("/").pop();
        const { results } = await env.db
          .prepare("SELECT * FROM pessoas WHERE id = ?")
          .bind(id)
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