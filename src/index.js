export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/produtos") {
      const { results } = await env.db
        .prepare("SELECT * FROM produtos")
        .run();
      return Response.json(results);
    }

    return new Response(
      "Call /api/produtos to see all products",
    );
  },
};