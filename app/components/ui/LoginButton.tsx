type GitHubLoginButtonProps = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function GitHubLoginButton({
  onClick,
  className = "",
  disabled = false,
}: GitHubLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 active:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.72 0-1.27.45-2.3 1.18-3.11-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.19a10.9 10.9 0 0 1 5.79 0c2.21-1.5 3.18-1.19 3.18-1.19.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.11 0 4.45-2.69 5.42-5.26 5.71.41.36.78 1.08.78 2.18v3.23c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>

      <span>Continue with GitHub</span>
    </button>
  );
}