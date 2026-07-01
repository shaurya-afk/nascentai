"use client";

import { FolderGit2, CheckCircle2, AlertTriangle, User, Palette, Sliders, ShieldAlert } from "lucide-react";
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
        description="Manage your account preferences, developer integrations, and workspace configuration."
      />

      <div className="max-w-3xl space-y-10">
        {/* Account Section */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
            <User className="h-4.5 w-4.5 text-neutral-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm py-1.5">
              <div>
                <p className="text-sm font-semibold text-white">{user?.github_username || "—"}</p>
                <p className="text-xs text-neutral-500 mt-1">GitHub ID: {user?.github_id || "—"}</p>
              </div>
              <Badge variant="success">Active User</Badge>
            </div>
          </div>
        </section>

        {/* GitHub Integration Section */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
            <FolderGit2 className="h-4.5 w-4.5 text-neutral-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">GitHub Integration</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  {isConnected ? "Nascent GitHub App installed" : "GitHub App installation required"}
                </p>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {isConnected
                    ? `Active Installation: ID ${user?.github_installation_id}. Nascent has write-access to your approved repositories to push branches and create pull requests.`
                    : "Install the Nascent GitHub App on your account or organization to permit branch creation and automated PR submissions."}
                </p>
              </div>
            </div>
            
            {!isConnected && (
              <Button onClick={() => authService.installGitHubApp()} variant="primary" className="py-2.5 px-4 text-xs">
                <FolderGit2 className="h-4 w-4 mr-1.5" />
                Install GitHub App
              </Button>
            )}
          </div>
        </section>

        {/* Preferences Section */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
            <Sliders className="h-4.5 w-4.5 text-neutral-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm py-1.5">
              <div>
                <p className="text-sm font-semibold text-white">Automated Commit Squashing</p>
                <p className="text-xs text-neutral-500 mt-1">Squash all AI commits into a single commit per pull request.</p>
              </div>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-border px-2.5 py-1 rounded">Enabled</span>
            </div>
            
            <div className="flex items-center justify-between text-sm py-1.5 border-t border-border/40 pt-4">
              <div>
                <p className="text-sm font-semibold text-white">Plan Verbosity</p>
                <p className="text-xs text-neutral-500 mt-1">Include detailed library imports and dependency structure in AI plans.</p>
              </div>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-border px-2.5 py-1 rounded">Normal</span>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
            <Palette className="h-4.5 w-4.5 text-neutral-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm py-1.5">
              <div>
                <p className="text-sm font-semibold text-white">Color Theme</p>
                <p className="text-xs text-neutral-500 mt-1">Select your preferred graphical interface theme.</p>
              </div>
              <span className="text-xs font-mono text-white bg-black border border-neutral-400 px-2.5 py-1 rounded">Monochromatic Dark</span>
            </div>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
            <ShieldAlert className="h-4.5 w-4.5 text-neutral-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm py-1.5">
              <div>
                <p className="text-sm font-semibold text-white">Delete Cache & Logs</p>
                <p className="text-xs text-neutral-500 mt-1">Wipe all locally stored repository states, code diffs, and thread records.</p>
              </div>
              <Button variant="danger" size="sm" className="bg-transparent border-dashed">Clear Cache</Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
