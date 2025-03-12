import { Database } from "../index";

export type CustomerSegment = Database["public"]["Tables"]["customer_segments"]["Row"];
export type CustomerNote = Database["public"]["Tables"]["customer_notes"]["Row"];
export type CustomerPreferences = Database["public"]["Tables"]["customer_preferences"]["Row"];
export type LoyaltyProgram = Database["public"]["Tables"]["loyalty_program"]["Row"];
export type LoyaltyTransaction = Database["public"]["Tables"]["loyalty_transactions"]["Row"];

export type CustomerWithRelations = Database["public"]["Tables"]["customers"]["Row"] & {
  segments?: CustomerSegment[];
  notes?: CustomerNote[];
  preferences?: CustomerPreferences;
  loyalty?: LoyaltyProgram & {
    transactions?: LoyaltyTransaction[];
  };
  addresses?: Database["public"]["Tables"]["customer_addresses"]["Row"][];
  orders?: Database["public"]["Tables"]["orders"]["Row"][];
};

export interface CustomerSegmentCriteria {
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in';
    value: string | number | boolean | Array<string | number>;
  }>;
  match_type: 'all' | 'any';
}

export type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface LoyaltyProgramWithDetails extends LoyaltyProgram {
  tier_benefits: {
    bronze: {
      points_multiplier: 1;
      benefits: string[];
    };
    silver: {
      points_multiplier: 1.2;
      benefits: string[];
    };
    gold: {
      points_multiplier: 1.5;
      benefits: string[];
    };
    platinum: {
      points_multiplier: 2;
      benefits: string[];
    };
    diamond: {
      points_multiplier: 3;
      benefits: string[];
    };
  };
}

export type TransactionType = 
  | 'order_completion'
  | 'points_redemption'
  | 'points_expiry'
  | 'manual_adjustment'
  | 'referral_bonus'
  | 'birthday_bonus'; 