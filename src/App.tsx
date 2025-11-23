function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-8">
      {/* Exemplo 1: Usando a Primária */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primaria">visto.io</h1>
        <p className="text-forte font-medium">
          Sistema de Vistoria Imobiliária
        </p>
      </div>

      {/* Exemplo 2: Cartão usando suas cores */}
      <div className="w-full max-w-sm p-6 rounded-xl border border-secundaria bg-white shadow-lg">
        <h2 className="text-xl font-bold text-forte mb-2">Teste de Cores</h2>
        <p className="text-gray-600 mb-6">
          Este cartão testa se o Tailwind está lendo sua config "primaria" e
          "secundaria".
        </p>

        {/* Botão Principal */}
        <button className="w-full py-3 rounded-lg bg-primaria text-primaria-foreground font-bold hover:bg-primaria/90 transition-colors mb-3">
          Botão Primário (bg-primaria)
        </button>

        {/* Botão Secundário */}
        <button className="w-full py-3 rounded-lg bg-secundaria text-secundaria-foreground font-bold hover:bg-secundaria/80 transition-colors">
          Botão Secundário (bg-secundaria)
        </button>
      </div>

      {/* Exemplo 3: Dica Visual */}
      <div className="p-4 bg-neutro rounded border border-gray-200 text-sm text-gray-500">
        Se você está vendo Verde Escuro e Verde Claro acima, funcionou!
      </div>
    </div>
  );
}

export default App;
