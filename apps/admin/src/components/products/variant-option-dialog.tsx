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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VariantOption,
  VariantAttributeType,
  VARIANT_ATTRIBUTE_TYPES,
  VARIANT_TEMPLATES,
} from "@/lib/types/products";

interface VariantOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: VariantOption) => void;
}

export function VariantOptionDialog({
  open,
  onOpenChange,
  onSave,
}: VariantOptionDialogProps) {
  const [type, setType] = useState<VariantAttributeType>("size");
  const [name, setName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [additionalCosts, setAdditionalCosts] = useState<
    Record<string, number>
  >({});

  const handleTypeSelect = (type: VariantAttributeType) => {
    setType(type);
    setName(VARIANT_ATTRIBUTE_TYPES[type]);
  };

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue && !values.includes(newValue)) {
      setValues([...values, newValue]);
      setAdditionalCosts({ ...additionalCosts, [newValue]: 0 });
      setNewValue("");
    }
  };

  const handleRemoveValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
    const { [value]: _, ...rest } = additionalCosts;
    setAdditionalCosts(rest);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && values.length > 0) {
      const option: VariantOption = {
        type,
        name,
        values,
        additional_costs: additionalCosts,
      };
      onSave(option);
      onOpenChange(false);
      // Reset form
      setType("size");
      setName("");
      setNewValue("");
      setValues([]);
      setAdditionalCosts({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Variant Option</DialogTitle>
          <DialogDescription>
            Create a new option for your variant bracket
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Option Type</Label>
            <Select value={type} onValueChange={handleTypeSelect}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VARIANT_ATTRIBUTE_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Option Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Size, Color, Material"
            />
          </div>

          <div className="space-y-2">
            <Label>Values</Label>
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter a value"
              />
              <Button type="button" onClick={handleAddValue}>
                Add
              </Button>
            </div>
            {type !== "custom" && VARIANT_TEMPLATES[type]?.predefinedValues && (
              <div className="flex flex-wrap gap-2 mt-2">
                {VARIANT_TEMPLATES[type].predefinedValues?.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!values.includes(value)) {
                        setValues([...values, value]);
                        setAdditionalCosts({ ...additionalCosts, [value]: 0 });
                      }
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {values.length > 0 && (
            <div className="space-y-2">
              <Label>Added Values</Label>
              <div className="space-y-2">
                {values.map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-2 p-2 rounded-lg border border-neutral-800"
                  >
                    <span className="flex-1">{value}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24"
                        placeholder="Extra cost"
                        value={additionalCosts[value] || ""}
                        onChange={(e) =>
                          setAdditionalCosts({
                            ...additionalCosts,
                            [value]: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveValue(value)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name || values.length === 0}>
              Add Option
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
