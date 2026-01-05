export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  country: string | null;
  timezone: string | null;
  push_reminders: boolean;
  auth_provider: string;
  image: string | null;
  role: string;
  activated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface PromoCode {
  id: string;
  code: string;
  expiration_date: string;
  usage_limit: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoCodeRequest {
  expiration_duration: number;
  usage_limit: number;
}

export interface UpdatePromoCodeRequest {
  expiration_duration?: number;
  usage_limit?: number;
}

export type BingoCardType = 'default' | 'custom';

export interface BingoCard {
  id: string;
  name: string;
  color: string;
  type: BingoCardType;
  category_ids: string[];
  created_by: string;
  font_color: string;
  font_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBingoCardRequest {
  name: string;
  color: string;
  category_ids: string[];
  font_color: string;
  font_name: string;
}

export interface UpdateBingoCardRequest {
  name?: string;
  color?: string;
  category_ids?: string[];
  font_color?: string;
  font_name?: string;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export type Theme = 'dark' | 'light' | 'system';

export type RevenuePeriod = 'daily' | 'weekly' | 'monthly' | 'range';

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface WeeklyRevenue {
  week: string;
  revenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface PaymentHistoryUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PaymentHistoryChallenge {
  id: string;
  organizer_id: string;
  title: string;
  plan: string;
  duration: number;
  card_size: number;
  status: string;
  image: string | null;
  category_id: string;
  invitation_code: string;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_intent: string;
  type: string;
  created_at: string;
  updated_at: string;
  user: PaymentHistoryUser;
  challenge?: PaymentHistoryChallenge;
}

export interface DateRangeRevenue {
  startDate: string;
  endDate: string;
  revenue: number;
  paymentHistory?: PaymentHistory[];
}

export interface TotalRevenue {
  totalRevenue: number;
}

export type ChallengeStatus = 'active' | 'inactive' | 'finish' | 'pending' | 'unpaid';

export type ChallengePlan = 'premium' | 'pro' | 'free' | 'basic';

export interface ChallengeOrganizer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Challenge {
  id: string;
  organizer_id: string;
  title: string;
  plan: ChallengePlan;
  is_organizer_participant: boolean;
  duration: number;
  card_size: number;
  status: ChallengeStatus;
  image: string | null;
  category_id: string;
  invitation_code: string;
  payment_intent_id: string | null;
  promo_code: string | null;
  starting_day_of_week?: string;
  current_week?: number | null;
  total_invitations?: number;
  joined_count?: number;
  createdAt: string;
  updatedAt: string;
  organizer?: ChallengeOrganizer;
  category?: ChallengeCategory;
}

export interface ChallengePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetChallengesResponse {
  data: Challenge[];
  pagination: ChallengePagination;
}

export interface UpdateChallengeStatusRequest {
  status: ChallengeStatus;
}

export interface StartNextWeekResponse {
  challenge_id: string;
  week_number: number;
}
