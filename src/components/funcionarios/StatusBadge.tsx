interface Props {
  ativo: boolean;
}

export function StatusBadge({ ativo }: Props) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full px-3 h-6
        text-sm font-medium leading-none
        ${
          ativo
            ? "bg-status-active-bg text-status-active-text"
            : "bg-status-inactive-bg text-status-inactive-text"
        }
      `}
    >
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}
