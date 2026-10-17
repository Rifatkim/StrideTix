export type AIChatRole = "system" | "user" | "assistant";

export interface AIChatMessage {
  id?: string;
  role: AIChatRole;
  content: string;
}

export interface RunnerTrainingContext {
  targetCategory?: string;
  longestRunKm?: number;
  weeklyFrequency?: number;
  averagePaceMinPerKm?: number;
  consistencyScore?: number;
  readinessLevel?: string;
}

export interface ChatRequestBody {
  messages: AIChatMessage[];
  runnerContext?: RunnerTrainingContext;
}

export interface ChatResponseBody {
  success: boolean;
  reply: string;
  error?: string;
  modelUsed?: string;
}

export interface RecommendationExplanationRequest {
  recommendedCategory: string | null;
  longestRunKm: number;
  weeklyFrequency: number;
  averagePaceMinPerKm: number;
  consistencyScore: number;
  readiness: string;
  totalRuns?: number;
}

export interface RecommendationExplanationResponse {
  success: boolean;
  explanation: string;
  safetyNotes: string;
  modelUsed?: string;
  error?: string;
}
