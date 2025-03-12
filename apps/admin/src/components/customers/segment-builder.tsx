"use client";

import { useState, useEffect } from "react";
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
import type { CustomerSegmentCriteria } from "@kurta-my/database/types/customer";

type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "not_contains"
  | "in"
  | "not_in";

interface Rule {
  id: string;
  field: string;
  operator: Operator;
  value: string | number | Array<string | number>;
}

interface SegmentBuilderProps {
  onSave: (criteria: CustomerSegmentCriteria) => Promise<void>;
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
  {
    value: "purchase_frequency",
    label: "Purchase Frequency (days)",
    type: "number",
  },
  {
    value: "days_since_last_order",
    label: "Days Since Last Order",
    type: "number",
  },
  { value: "lifetime_value", label: "Customer Lifetime Value", type: "number" },
  {
    value: "product_categories",
    label: "Product Categories Purchased",
    type: "array",
  },
  { value: "order_channels", label: "Order Channels", type: "array" },
  { value: "payment_methods", label: "Payment Methods Used", type: "array" },
  { value: "discount_usage", label: "Discount Usage Count", type: "number" },
  {
    value: "cart_abandonment_rate",
    label: "Cart Abandonment Rate",
    type: "number",
  },
  {
    value: "average_items_per_order",
    label: "Avg Items per Order",
    type: "number",
  },
  { value: "return_rate", label: "Return Rate", type: "number" },
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
    ],
  },
  string: {
    label: "Text",
    operators: [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Does not equal" },
      { value: "contains", label: "Contains" },
      { value: "not_contains", label: "Does not contain" },
    ],
  },
  array: {
    label: "List",
    operators: [
      { value: "in", label: "Includes any" },
      { value: "not_in", label: "Does not include" },
    ],
  },
  date: {
    label: "Date",
    operators: [
      { value: "equals", label: "On" },
      { value: "greater_than", label: "After" },
      { value: "less_than", label: "Before" },
    ],
  },
};

interface SegmentAnalytics {
  estimatedSize: number;
  averageOrderValue: number;
  totalRevenue: number;
  orderFrequency: number;
  topProducts: Array<{ name: string; count: number }>;
  topCategories: Array<{ name: string; count: number }>;
}

export function SegmentBuilder({
  onSave,
  initialRules = [],
}: SegmentBuilderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<SegmentAnalytics | null>(null);
  const [matchType, setMatchType] = useState<"all" | "any">("all");
  const [previewLoading, setPreviewLoading] = useState(false);

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

  const fetchSegmentAnalytics = async () => {
    if (rules.length === 0) {
      setAnalytics(null);
      return;
    }

    try {
      setPreviewLoading(true);
      const response = await fetch("/api/customers/segments/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          criteria: {
            conditions: rules.map(({ field, operator, value }) => ({
              field,
              operator,
              value,
            })),
            match_type: matchType,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch segment preview");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching segment preview:", error);
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSegmentAnalytics();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [rules, matchType]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave({
        conditions: rules.map(({ field, operator, value }) => ({
          field,
          operator,
          value,
        })),
        match_type: matchType,
      });
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
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Match</span>
          <Select
            value={matchType}
            onValueChange={(value: "all" | "any") => setMatchType(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rules</SelectItem>
              <SelectItem value="any">Any rule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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

      {/* Segment Analytics Preview */}
      {previewLoading ? (
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
          </div>
        </Card>
      ) : (
        analytics && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Segment Preview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-400">Estimated Size</p>
                <p className="text-2xl font-medium text-white">
                  {analytics.estimatedSize.toLocaleString()} customers
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Average Order Value</p>
                <p className="text-2xl font-medium text-white">
                  ${analytics.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Revenue</p>
                <p className="text-2xl font-medium text-white">
                  ${analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Order Frequency</p>
                <p className="text-2xl font-medium text-white">
                  {analytics.orderFrequency.toFixed(1)} days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">
                  Top Products
                </h4>
                <div className="space-y-2">
                  {analytics.topProducts.map((product) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-neutral-400">
                        {product.name}
                      </span>
                      <span className="text-sm text-white">
                        {product.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-2">
                  Top Categories
                </h4>
                <div className="space-y-2">
                  {analytics.topCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-neutral-400">
                        {category.name}
                      </span>
                      <span className="text-sm text-white">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  );
}
