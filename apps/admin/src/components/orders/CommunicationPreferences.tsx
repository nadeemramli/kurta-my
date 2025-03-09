import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CommunicationPreferences as CommunicationPrefsType } from "@/lib/types/orders";
import { toast } from "sonner";

interface CommunicationPreferencesProps {
  orderId: string;
  initialPreferences: CommunicationPrefsType;
  hasPhone: boolean;
  hasEmail: boolean;
  onUpdate: (preferences: CommunicationPrefsType) => Promise<void>;
}

export function CommunicationPreferences({
  orderId,
  initialPreferences,
  hasPhone,
  hasEmail,
  onUpdate,
}: CommunicationPreferencesProps) {
  const [preferences, setPreferences] =
    useState<CommunicationPrefsType>(initialPreferences);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = (channel: keyof CommunicationPrefsType) => {
    // Validate requirements before toggling
    if (!hasPhone && (channel === "whatsapp" || channel === "sms")) {
      toast.error("Phone number is required for this communication channel");
      return;
    }

    if (!hasEmail && channel === "email") {
      toast.error("Email address is required for this communication channel");
      return;
    }

    setPreferences((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await onUpdate(preferences);
      toast.success("Communication preferences updated");
    } catch (error) {
      toast.error("Failed to update communication preferences");
      console.error("Error updating preferences:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Communication Preferences
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Choose how you would like to receive updates about this order.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <p className="text-sm text-gray-500">
                Receive order updates via WhatsApp
              </p>
            </div>
            <Switch
              id="whatsapp"
              checked={preferences.whatsapp}
              onCheckedChange={() => handleToggle("whatsapp")}
              disabled={!hasPhone || isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email</Label>
              <p className="text-sm text-gray-500">
                Receive order updates via email
              </p>
            </div>
            <Switch
              id="email"
              checked={preferences.email}
              onCheckedChange={() => handleToggle("email")}
              disabled={!hasEmail || isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms">SMS</Label>
              <p className="text-sm text-gray-500">
                Receive order updates via SMS
              </p>
            </div>
            <Switch
              id="sms"
              checked={preferences.sms}
              onCheckedChange={() => handleToggle("sms")}
              disabled={!hasPhone || isUpdating}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={
              isUpdating ||
              JSON.stringify(preferences) === JSON.stringify(initialPreferences)
            }
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
