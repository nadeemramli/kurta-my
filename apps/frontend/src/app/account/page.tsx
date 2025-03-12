"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-neutral-500">
            Manage your account settings and preferences
          </p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-neutral-100 p-2">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-sm text-neutral-500">
                Update your account profile information
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-neutral-50"
              />
              <p className="text-xs text-neutral-500">
                Your email address is used for signing in and notifications
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  defaultValue={user.user_metadata?.first_name}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  defaultValue={user.user_metadata?.last_name}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-neutral-100 p-2">
              <LogOut className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold">Sign Out</h2>
              <p className="text-sm text-neutral-500">
                Sign out of your account on all devices
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="destructive" onClick={() => signOut()}>
              Sign Out of All Devices
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
