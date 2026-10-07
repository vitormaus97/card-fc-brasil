export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      card_variants: {
        Row: {
          autograph: boolean
          card_id: string
          id: string
          parallel: string
          print_run: number | null
        }
        Insert: {
          autograph?: boolean
          card_id: string
          id: string
          parallel: string
          print_run?: number | null
        }
        Update: {
          autograph?: boolean
          card_id?: string
          id?: string
          parallel?: string
          print_run?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_variants_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "catalog_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_cards: {
        Row: {
          card_number: string
          club: string
          collection: string
          id: string
          illustrative: boolean
          image: string
          manufacturer: string
          player: string
          season: string
        }
        Insert: {
          card_number: string
          club: string
          collection: string
          id: string
          illustrative?: boolean
          image: string
          manufacturer: string
          player: string
          season: string
        }
        Update: {
          card_number?: string
          club?: string
          collection?: string
          id?: string
          illustrative?: boolean
          image?: string
          manufacturer?: string
          player?: string
          season?: string
        }
        Relationships: []
      }
      physical_copies: {
        Row: {
          condition: string
          created_at: string
          grading: string
          id: string
          owner_id: string
          serial: string
          variant_id: string
        }
        Insert: {
          condition?: string
          created_at?: string
          grading?: string
          id?: string
          owner_id?: string
          serial?: string
          variant_id: string
        }
        Update: {
          condition?: string
          created_at?: string
          grading?: string
          id?: string
          owner_id?: string
          serial?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "physical_copies_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "card_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name?: string
          id: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          buyer_id: string
          copy_id: string
          created_at: string
          id: string
          received_at: string | null
          seller_id: string
          status: string
        }
        Insert: {
          buyer_id: string
          copy_id: string
          created_at?: string
          id?: string
          received_at?: string | null
          seller_id: string
          status?: string
        }
        Update: {
          buyer_id?: string
          copy_id?: string
          created_at?: string
          id?: string
          received_at?: string | null
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: false
            referencedRelation: "physical_copies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchased_collection: {
        Row: {
          acquired_at: string
          copy_id: string
          id: string
          order_id: string
          owner_id: string
        }
        Insert: {
          acquired_at?: string
          copy_id: string
          id?: string
          order_id: string
          owner_id: string
        }
        Update: {
          acquired_at?: string
          copy_id?: string
          id?: string
          order_id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_collection_copy_id_fkey"
            columns: ["copy_id"]
            isOneToOne: true
            referencedRelation: "physical_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_collection_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist: {
        Row: {
          created_at: string
          user_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          user_id?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "card_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
