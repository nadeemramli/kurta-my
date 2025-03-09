import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VariantBracket } from "@/lib/types/products";

interface VariantBracketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bracket: VariantBracket) => void;
}

export function VariantBracketDialog({
  open,
  onOpenChange,
  onSave,
}: VariantBracketDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (name) {
      const newBracket: VariantBracket = {
        id: crypto.randomUUID(),
        name,
        description,
        options: [],
      };
      onSave(newBracket);
      onOpenChange(false);
      // Reset form
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Variant Bracket</DialogTitle>
          <DialogDescription>
            Create a new bracket to group related variant options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bracket Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sizing, Colors, Materials"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this bracket groups together"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name}>
              Add Bracket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
