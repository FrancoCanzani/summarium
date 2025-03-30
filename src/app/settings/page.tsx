"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/use-auth";
import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();

  const { email } = useAuth();

  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-3">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Settings</h2>
        <div className="flex items-center justify-end space-x-4">
          <button
            className="hover:underline hover:underline-offset-4"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
          >
            Sign Out
          </button>
          <Link
            href={"/notes"}
            className="hover:underline hover:underline-offset-4"
          >
            Notes
          </Link>
        </div>
      </header>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium">{email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Change Password</span>
            <button className="text-sm text-blue-500 hover:underline">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Delete Account</span>
            <ConfirmActionDialog
              onConfirm={() => {}}
              title="Permanently Delete Your Account"
              description="This action cannot be undone. Deleting your account will permanently erase all your data, including your notes and preferences. Please confirm if you wish to proceed."
            >
              <button className="text-sm text-red-500 hover:underline">
                Delete Account
              </button>
            </ConfirmActionDialog>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">App Preferences</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <button className="text-sm text-blue-500 hover:underline">
              Toggle
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <h4>AI</h4>
          <div className="flex flex-row items-center justify-between rounded-sm border p-2 text-sm">
            <div className="flex flex-col space-y-1.5">
              <label className="text-muted-foreground">
                Hide all AI Features
              </label>
              <p className="text-xs">
                If this is enabled, you will not see any of the AI features in
                the editor (transcriptions, text to speech, assistant...).
              </p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} />
          </div>
          <div className="flex flex-row items-center justify-between rounded-sm border p-2 text-sm">
            <div className="flex flex-col space-y-1.5">
              <label className="text-muted-foreground">
                Enable AI Suggestions
              </label>
              <p className="text-xs">
                You will not get any suggestions on tab press.
              </p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} />
          </div>

          <div className="flex flex-row items-center justify-between rounded-sm border p-2 text-sm">
            <div className="flex w-full flex-col space-y-2.5">
              <label className="text-muted-foreground">
                Provide your own Open AI Api Key
              </label>
              <Input type="password" className="w-full rounded-sm" />
              <p className="text-xs">
                Read more about how we handle this feature in the docs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Notifications</span>
            <button className="text-sm text-blue-500 hover:underline">
              Toggle
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Push Notifications</span>
            <button className="text-sm text-blue-500 hover:underline">
              Toggle
            </button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Data Management</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Export Notes</span>
            <button className="text-sm text-blue-500 hover:underline">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Import Notes</span>
            <button className="text-sm text-blue-500 hover:underline">
              Import
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Clear All Notes</span>
            <button className="text-sm text-red-500 hover:underline">
              Clear
            </button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">About</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">App Version</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Privacy Policy</span>
            <Link
              href="/privacy-policy"
              className="text-sm text-blue-500 hover:underline"
            >
              View
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Terms of Service</span>
            <Link
              href="/terms-of-service"
              className="text-sm text-blue-500 hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
