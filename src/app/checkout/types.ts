// Checkout types and configurations
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  inputProps?: {
    pattern?: string;
    title?: string;
    maxLength?: number;
  };
}

export type FieldSet = FormField[];

export type Step = 'select' | 'forms' | 'review' | 'payment';

export interface TeamSizeConfig {
  min: number;
  max: number;
}

export interface PaymentStatus {
  success: boolean;
  status: string;
  transactionId?: string;
  amount?: number;
  method?: string;
  reason?: string;
}

export interface FlagshipBenefits {
  supportArtistQuantity: number;
  supportArtistDetails: Array<Record<string, string>>;
  flagshipVisitorPassQuantity: number;
  flagshipVisitorPassDetails: Array<Record<string, string>>;
  flagshipSoloVisitorPassQuantity: number;
  flagshipSoloVisitorPassDetails: Array<Record<string, string>>;
}

export interface CheckoutState {
  selectedEventIds: number[];
  visitorPassDays: number;
  visitorPassDetails: Record<string, string>;
  flagshipBenefitsByEvent: Record<number, FlagshipBenefits>;
  formDataBySignature: Record<string, Record<string, string>>;
  teamMembersBySignature: Record<string, Array<Record<string, string>>>;
  promoInput: string;
  appliedPromo: { code: string; discountAmount: number } | null;
}
