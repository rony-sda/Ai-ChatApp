import { NextRequest, NextResponse } from 'next/server';

interface ModelPricing {
  prompt: string;
  completion: string;
  request?: string;
  image?: string;
  web_search?: string;
  internal_reasoning?: string;
}

interface ModelArchitecture {
  modality: string;
  input_modalities: string[];
  output_modalities: string[];
  tokenizer: string;
  instruct_type: string | null;
}

interface TopProvider {
  context_length: number;
  max_completion_tokens: number;
  is_moderated: boolean;
}

export interface Model {
  id: string;
  canonical_slug: string;
  hugging_face_id?: string | null;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: ModelArchitecture;
  pricing: ModelPricing;
  top_provider: TopProvider;
  per_request_limits: unknown | null;
  supported_parameters: string[];
  default_parameters: {
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number | null;
  };
}

interface OpenRouterResponse {
  data: Model[];
}


export async function GET(req: NextRequest) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();

    const freeModels: Model[] = data.data.filter((model) => {
      const promptPrice = parseFloat(model.pricing?.prompt ?? '0');
      const completionPrice = parseFloat(model.pricing?.completion ?? '0');
      return promptPrice === 0 && completionPrice === 0;
    });

    return NextResponse.json({
      models: freeModels,
    });

  } catch (error: unknown) {
    console.error('Error fetching free models:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to fetch free models';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

