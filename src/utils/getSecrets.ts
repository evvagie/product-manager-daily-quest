
import { supabase } from '@/integrations/supabase/client';

export const getOpenAIKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-secrets');
    
    if (error) {
      throw new Error(`Failed to get secrets: ${error.message}`);
    }
    
    if (!data?.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found in secrets');
    }
    
    return data.OPENAI_API_KEY;
  } catch (error) {
    console.error('Error getting OpenAI key:', error);
    throw error;
  }
};
