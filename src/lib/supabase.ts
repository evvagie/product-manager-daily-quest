
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please set up your Supabase project and add the URL to your environment variables.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please set up your Supabase project and add the anonymous key to your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          xp: number
          level: number
          streak: number
          progression_jour: number
          last_active_at: string
          date_inscription: string
        }
        Insert: {
          id: string
          email: string
          username: string
          xp?: number
          level?: number
          streak?: number
          progression_jour?: number
          last_active_at?: string
          date_inscription?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          xp?: number
          level?: number
          streak?: number
          progression_jour?: number
          last_active_at?: string
          date_inscription?: string
        }
      }
      challenges: {
        Row: {
          id: string
          titre: string
          categorie: string
          difficulte: string
          type: string
          contenu: any
          correction: any
          ressources_reco: any
          visible: boolean
          ordre: number
          tags: string[]
        }
        Insert: {
          id?: string
          titre: string
          categorie: string
          difficulte: string
          type: string
          contenu: any
          correction: any
          ressources_reco?: any
          visible?: boolean
          ordre: number
          tags?: string[]
        }
        Update: {
          id?: string
          titre?: string
          categorie?: string
          difficulte?: string
          type?: string
          contenu?: any
          correction?: any
          ressources_reco?: any
          visible?: boolean
          ordre?: number
          tags?: string[]
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          xp_gagne: number
          duree_totale: number
          classement_jour: number
          session_complete: boolean
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          xp_gagne: number
          duree_totale: number
          classement_jour: number
          session_complete: boolean
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          xp_gagne?: number
          duree_totale?: number
          classement_jour?: number
          session_complete?: boolean
        }
      }
      user_challenge_results: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          session_id: string
          date: string
          choix_utilisateur: any
          reussite: boolean
          declenche_apprentissage_profond: boolean
          xp_gagne: number
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          session_id: string
          date: string
          choix_utilisateur: any
          reussite: boolean
          declenche_apprentissage_profond: boolean
          xp_gagne: number
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          session_id?: string
          date?: string
          choix_utilisateur?: any
          reussite?: boolean
          declenche_apprentissage_profond?: boolean
          xp_gagne?: number
        }
      }
      badges: {
        Row: {
          id: string
          nom: string
          description: string
          icone: string
          condition_technique: string
        }
        Insert: {
          id?: string
          nom: string
          description: string
          icone: string
          condition_technique: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string
          icone?: string
          condition_technique?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          date_obtenue: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          date_obtenue: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          date_obtenue?: string
        }
      }
      resources: {
        Row: {
          id: string
          titre: string
          type: string
          lien: string
          niveau: string
          challenge_id?: string
        }
        Insert: {
          id?: string
          titre: string
          type: string
          lien: string
          niveau: string
          challenge_id?: string
        }
        Update: {
          id?: string
          titre?: string
          type?: string
          lien?: string
          niveau?: string
          challenge_id?: string
        }
      }
    }
  }
}
