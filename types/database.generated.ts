export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          address: string | null
          created_at: string
          id: string
          mail: string | null
          mobile: string | null
          name: string | null
          phone: string | null
          tags: string[] | null
          updated_by: string | null
          full_text: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          mail?: string | null
          mobile?: string | null
          name?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          mail?: string | null
          mobile?: string | null
          name?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          team_id: string
          user_id: string
        }
        Insert: {
          team_id: string
          user_id: string
        }
        Update: {
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id?: string
          role: string
        }
        Update: {
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      full_text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
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
