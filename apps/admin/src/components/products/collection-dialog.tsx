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
import { ProductCollection } from "@/lib/types/products";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (collection: ProductCollection) => void;
}

export function CollectionDialog({
  open,
  onOpenChange,
  onSuccess,
}: CollectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        toast.error("Collection title is required");
        return;
      }

      setIsSubmitting(true);

      const slug =
        formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("collections")
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
        })
        .select()
        .single();

      if (error) throw error;

      onSuccess(data);
      onOpenChange(false);
      setFormData({ title: "", slug: "", description: "" });
      toast.success("Collection created successfully");
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Add a new collection to organize your products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Summer Collection, New Arrivals"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="auto-generated-from-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe this collection"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
