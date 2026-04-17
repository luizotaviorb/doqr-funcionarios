"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-muted-foreground">Erro ao carregar funcionários.</p>
      <button onClick={reset} className="text-primary underline">
        Tentar novamente
      </button>
    </div>
  );
}
