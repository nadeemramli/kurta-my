"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";

type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "between"
  | "in_list";

interface Rule {
  id: string;
  field: string;
  operator: Operator;
  value: string | number | string[];
}

interface SegmentBuilderProps {
  onSave: (rules: Rule[]) => Promise<void>;
  initialRules?: Rule[];
}

const AVAILABLE_FIELDS = [
  { value: "total_spent", label: "Total Spent", type: "number" },
  { value: "orders_count", label: "Number of Orders", type: "number" },
  { value: "last_order_date", label: "Last Order Date", type: "date" },
  { value: "tags", label: "Customer Tags", type: "array" },
  { value: "products_purchased", label: "Products Purchased", type: "array" },
  {
    value: "average_order_value",
    label: "Average Order Value",
    type: "number",
  },
  { value: "first_order_date", label: "First Order Date", type: "date" },
  { value: "location", label: "Location", type: "string" },
  { value: "signup_date", label: "Sign Up Date", type: "date" },
];

const OPERATORS: Record<
  string,
  { label: string; operators: Array<{ value: Operator; label: string }> }
> = {
  number: {
    label: "Number",
    operators: [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Does not equal" },
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "between", label: "Between" },
    ],
  },
  string: {
    label: "Text",
    operators: [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Does not equal" },
      { value: "contains", label: "Contains" },
    ],
  },
  array: {
    label: "List",
    operators: [
      { value: "in_list", label: "Includes any" },
      { value: "not_equals", label: "Does not include" },
    ],
  },
  date: {
    label: "Date",
    operators: [
      { value: "equals", label: "On" },
      { value: "greater_than", label: "After" },
      { value: "less_than", label: "Before" },
      { value: "between", label: "Between" },
    ],
  },
};

export function SegmentBuilder({
  onSave,
  initialRules = [],
}: SegmentBuilderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [loading, setLoading] = useState(false);

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      field: AVAILABLE_FIELDS[0].value,
      operator: "equals",
      value: "",
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(rules);
    } catch (error) {
      console.error("Error saving segment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFieldType = (fieldValue: string) => {
    return (
      AVAILABLE_FIELDS.find((field) => field.value === fieldValue)?.type ||
      "string"
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {rules.map((rule) => {
          const fieldType = getFieldType(rule.field);
          return (
            <Card key={rule.id} className="p-4">
              <div className="flex items-center gap-4">
                <Select
                  value={rule.field}
                  onValueChange={(value) =>
                    updateRule(rule.id, {
                      field: value,
                      operator: "equals",
                      value: "",
                    })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FIELDS.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={rule.operator}
                  onValueChange={(value) =>
                    updateRule(rule.id, { operator: value as Operator })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS[fieldType].operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {rule.operator === "between" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type={fieldType === "date" ? "date" : "text"}
                      className="w-[150px]"
                      placeholder="From"
                      value={Array.isArray(rule.value) ? rule.value[0] : ""}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          value: [
                            e.target.value,
                            Array.isArray(rule.value) ? rule.value[1] : "",
                          ],
                        })
                      }
                    />
                    <span className="text-neutral-400">and</span>
                    <Input
                      type={fieldType === "date" ? "date" : "text"}
                      className="w-[150px]"
                      placeholder="To"
                      value={Array.isArray(rule.value) ? rule.value[1] : ""}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          value: [
                            Array.isArray(rule.value) ? rule.value[0] : "",
                            e.target.value,
                          ],
                        })
                      }
                    />
                  </div>
                ) : (
                  <Input
                    type={fieldType === "date" ? "date" : "text"}
                    className="w-[300px]"
                    placeholder={`Enter ${
                      fieldType === "array" ? "comma-separated values" : "value"
                    }`}
                    value={
                      Array.isArray(rule.value)
                        ? rule.value.join(", ")
                        : rule.value
                    }
                    onChange={(e) =>
                      updateRule(rule.id, {
                        value:
                          fieldType === "array"
                            ? e.target.value.split(",").map((v) => v.trim())
                            : e.target.value,
                      })
                    }
                  />
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeRule(rule.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
        <Button onClick={handleSave} disabled={loading || rules.length === 0}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Segment"}
        </Button>
      </div>

      {rules.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-2">Preview Query</h3>
          <pre className="text-sm text-neutral-400 whitespace-pre-wrap">
            {JSON.stringify(rules, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
