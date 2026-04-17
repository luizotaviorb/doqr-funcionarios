const USER_NAME = "Luiz Otávio";

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-border h-16 px-8 lg:px-32">
      <div className="flex items-center gap-2">
        <div className="td-icon w-8 h-8 rounded bg-primary flex items-center justify-center text-white shrink-0">
          TD
        </div>
        <span className="text-base font-bold text-foreground leading-none tracking-normal">
          Teste Doqr
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-avatar-bg shrink-0" />
        <span className="text-base font-semibold text-foreground">
          {USER_NAME}
        </span>
      </div>
    </header>
  );
}
