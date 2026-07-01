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
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-16 w-16 rounded-full border"
        />

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {user.username}
          </h2>

          <p className="text-sm text-neutral-500">
            Connected GitHub Account
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between rounded-lg bg-neutral-100 p-4">
        <div>
          <p className="text-2xl font-bold">{user.repositories}</p>
          <p className="text-sm text-neutral-500">
            Repositories
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-green-600">
            Connected
          </p>

          <p className="text-sm text-neutral-500">
            GitHub App
          </p>
        </div>
      </div>
    </div>
  );
}