import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItemInput {
  title: string;
  description?: string;
  url?: string;
}

export const usePortfolio = (userId: string) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar portfólio.");
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchItems();
  }, [userId, fetchItems]);

  const createItem = async (input: PortfolioItemInput): Promise<boolean> => {
    setSaving(true);
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast.error("Erro ao adicionar item.");
      return false;
    }

    setItems((prev) => [data, ...prev]);
    toast.success("Item adicionado ao portfólio!");
    return true;
  };

  const updateItem = async (id: string, input: PortfolioItemInput): Promise<boolean> => {
    setSaving(true);
    const { data, error } = await supabase
      .from("portfolio_items")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast.error("Erro ao atualizar item.");
      return false;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
    toast.success("Item atualizado!");
    return true;
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao remover item.");
      return false;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removido.");
    return true;
  };

  return { items, loading, saving, createItem, updateItem, deleteItem, refetch: fetchItems };
};
