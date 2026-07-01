type User = {
  username: string;
  avatar: string;
  repositories: number;
};

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="w-full rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-16 w-16 rounded-full border border-border"
        />

        <div>
          <h2 className="text-lg font-semibold text-white">
            {user.username}
          </h2>

          <p className="text-sm text-neutral-400">
            Connected GitHub Account
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between rounded-lg bg-surface-elevated border border-border p-4">
        <div>
          <p className="text-2xl font-bold text-white">{user.repositories}</p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
            Repositories
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            Connected
          </p>

          <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
            GitHub App
          </p>
        </div>
      </div>
    </div>
  );
}