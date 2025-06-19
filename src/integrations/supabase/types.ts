export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          challenges_required: number | null
          created_at: string
          description: string
          icon: string
          id: string
          is_secret: boolean | null
          level_required: number | null
          name: string
          skill_areas_required: string[] | null
          sort_order: number | null
          streak_required: number | null
          xp_required: number | null
        }
        Insert: {
          category: string
          challenges_required?: number | null
          created_at?: string
          description: string
          icon: string
          id?: string
          is_secret?: boolean | null
          level_required?: number | null
          name: string
          skill_areas_required?: string[] | null
          sort_order?: number | null
          streak_required?: number | null
          xp_required?: number | null
        }
        Update: {
          category?: string
          challenges_required?: number | null
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_secret?: boolean | null
          level_required?: number | null
          name?: string
          skill_areas_required?: string[] | null
          sort_order?: number | null
          streak_required?: number | null
          xp_required?: number | null
        }
        Relationships: []
      }
      challenge_history: {
        Row: {
          challenge_id: string
          challenge_title: string
          challenge_type: string
          completion_date: string
          created_at: string
          difficulty: string
          id: string
          score: number | null
          skill_area: string
          time_taken: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          challenge_title: string
          challenge_type: string
          completion_date?: string
          created_at?: string
          difficulty: string
          id?: string
          score?: number | null
          skill_area: string
          time_taken?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          challenge_title?: string
          challenge_type?: string
          completion_date?: string
          created_at?: string
          difficulty?: string
          id?: string
          score?: number | null
          skill_area?: string
          time_taken?: number | null
          user_id?: string
        }
        Relationships: []
      }
      challenge_metadata: {
        Row: {
          challenge_types: Json
          created_at: string
          id: string
          skill_area: string
          total_challenges: number
        }
        Insert: {
          challenge_types?: Json
          created_at?: string
          id?: string
          skill_area: string
          total_challenges?: number
        }
        Update: {
          challenge_types?: Json
          created_at?: string
          id?: string
          skill_area?: string
          total_challenges?: number
        }
        Relationships: []
      }
      daily_recommendations: {
        Row: {
          author_speaker: string
          created_at: string
          date: string
          description: string
          difficulty_level: string
          id: string
          performance_context: Json | null
          recommendation_type: string
          skill_area: string
          source_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          author_speaker: string
          created_at?: string
          date?: string
          description: string
          difficulty_level: string
          id?: string
          performance_context?: Json | null
          recommendation_type: string
          skill_area: string
          source_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          author_speaker?: string
          created_at?: string
          date?: string
          description?: string
          difficulty_level?: string
          id?: string
          performance_context?: Json | null
          recommendation_type?: string
          skill_area?: string
          source_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      exercise_scores: {
        Row: {
          challenge_session_id: string
          completion_date: string
          correct_answer: string | null
          created_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          question_title: string
          score_percentage: number
          time_taken: number | null
          user_answer: string | null
          user_id: string
        }
        Insert: {
          challenge_session_id: string
          completion_date?: string
          correct_answer?: string | null
          created_at?: string
          exercise_id: string
          id?: string
          is_correct?: boolean
          question_title: string
          score_percentage?: number
          time_taken?: number | null
          user_answer?: string | null
          user_id: string
        }
        Update: {
          challenge_session_id?: string
          completion_date?: string
          correct_answer?: string | null
          created_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          question_title?: string
          score_percentage?: number
          time_taken?: number | null
          user_answer?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          classement_jour: number
          created_at: string
          date: string
          duree_totale: number
          id: string
          session_complete: boolean
          user_id: string
          xp_gagne: number
        }
        Insert: {
          classement_jour?: number
          created_at?: string
          date?: string
          duree_totale?: number
          id?: string
          session_complete?: boolean
          user_id: string
          xp_gagne?: number
        }
        Update: {
          classement_jour?: number
          created_at?: string
          date?: string
          duree_totale?: number
          id?: string
          session_complete?: boolean
          user_id?: string
          xp_gagne?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          date_inscription: string
          email: string
          id: string
          last_active_at: string | null
          last_streak_update: string | null
          level: number
          progression_jour: number
          streak: number
          username: string
          xp: number
        }
        Insert: {
          date_inscription?: string
          email: string
          id: string
          last_active_at?: string | null
          last_streak_update?: string | null
          level?: number
          progression_jour?: number
          streak?: number
          username: string
          xp?: number
        }
        Update: {
          date_inscription?: string
          email?: string
          id?: string
          last_active_at?: string | null
          last_streak_update?: string | null
          level?: number
          progression_jour?: number
          streak?: number
          username?: string
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_realistic_streak: {
        Args: { user_uuid: string }
        Returns: number
      }
      check_and_grant_achievements: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_achievements_with_progress: {
        Args: { user_uuid: string }
        Returns: {
          achievement_id: string
          name: string
          description: string
          icon: string
          category: string
          is_unlocked: boolean
          unlocked_at: string
          progress_percentage: number
          current_value: number
          required_value: number
        }[]
      }
      refresh_all_streaks: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      update_user_streak: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
