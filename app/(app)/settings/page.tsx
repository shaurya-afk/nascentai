"use client";

import { FolderGit2, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/app/components/layout/Header";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { useAuth } from "@/app/contexts/AuthContext";
import { authService } from "@/app/services/auth.service";

export default function SettingsPage() {
  const { user } = useAuth();
  const isConnected = !!user?.github_installation_id;

  return (
    <>
      <Header
        title="Settings"
        description="Manage your GitHub connection and account preferences."
      />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-surface-elevated flex items-center gap-2">
            <FolderGit2 className="h-5 w-5" />
            <h2 className="text-sm font-semibold">GitHub Account</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.github_username}</p>
                <p className="text-xs text-muted">GitHub ID: {user?.github_id}</p>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-surface-elevated">
            <h2 className="text-sm font-semibold">GitHub App Installation</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isConnected ? "App installed" : "App not installed"}
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {isConnected
                    ? `Installation ID: ${user?.github_installation_id}. Nascent can push branches and create pull requests.`
                    : "Install the Nascent GitHub App on your repositories to enable push and pull request creation."}
                </p>
              </div>
            </div>
            {!isConnected && (
              <Button onClick={() => authService.installGitHubApp()}>
                <FolderGit2 className="h-4 w-4" />
                Install GitHub App
              </Button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
