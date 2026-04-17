import { Skeleton } from "@/components/ui/skeleton";

const TABLE_HEADERS = [
  "Nome",
  "E-mail",
  "CPF",
  "Celular",
  "Data de Nascimento",
  "Tipo Contratação",
  "Status",
  "Ação",
];

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#13131f]">
      <div className="bg-background mx-auto min-h-screen max-w-[1440px]">
        <header className="flex items-center justify-between border-b border-border h-16 px-8 lg:px-[130px]">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
        </header>
        <div className="px-8 lg:px-[130px] pb-12">
          <div className="mt-8 mb-8 flex flex-col gap-2">
            <Skeleton className="w-72 h-9" />
            <Skeleton className="w-48 h-5" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="w-full max-w-sm h-9" />
            <Skeleton className="w-44 h-9" />
          </div>
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <table className="table-fixed w-full">
              <thead>
                <tr className="bg-table-header-bg border-b border-border">
                  {TABLE_HEADERS.map((h) => (
                    <th key={h} className="table-header-cell">
                      <Skeleton className="h-4 w-3/4" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="table-cell">
                        <Skeleton className="h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
