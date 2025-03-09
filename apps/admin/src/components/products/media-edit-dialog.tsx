import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductMedia } from "@/lib/types/products";
import { useState } from "react";
import { TooltipWithLink } from "./product-sheet";

interface MediaEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: ProductMedia;
  onSave: (updatedMedia: ProductMedia) => void;
}

export function MediaEditDialog({
  open,
  onOpenChange,
  media,
  onSave,
}: MediaEditDialogProps) {
  const [formData, setFormData] = useState<ProductMedia>(media);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Media Details</DialogTitle>
          <DialogDescription>
            Optimize your product media for better SEO and accessibility.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="alt">Alt Text</Label>
              <TooltipWithLink
                text={`Alt text helps:
• Screen readers describe images to visually impaired users
• Search engines understand your images
• Display text when images fail to load

Good alt text should:
• Be specific and descriptive
• Include relevant keywords naturally
• Keep it under 125 characters
• Avoid starting with "image of" or "picture of"`}
                link="https://help.shopify.com/en/manual/products/product-media/image-alt-text"
              />
            </div>
            <Textarea
              id="alt"
              value={formData.alt || ""}
              onChange={(e) =>
                setFormData({ ...formData, alt: e.target.value })
              }
              placeholder="Describe this image in detail for SEO and accessibility"
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Image title (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={formData.caption || ""}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
              placeholder="Image caption (optional)"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
