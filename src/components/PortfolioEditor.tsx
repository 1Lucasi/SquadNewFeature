import { useState } from "react";
import { usePortfolio, PortfolioItem, PortfolioItemInput } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Check, X } from "lucide-react";

interface PortfolioEditorProps {
  userId: string;
}

const EMPTY_FORM: PortfolioItemInput = { title: "", description: "", url: "" };

const PortfolioEditor = ({ userId }: PortfolioEditorProps) => {
  const { items, loading, saving, createItem, updateItem, deleteItem } = usePortfolio(userId);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioItemInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Título é obrigatório";
    if (form.url && !/^https?:\/\/.+/.test(form.url.trim())) {
      e.url = "URL deve começar com http:// ou https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setForm({ title: item.title, description: item.description ?? "", url: item.url ?? "" });
    setErrors({});
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: PortfolioItemInput = {
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      url: form.url?.trim() || undefined,
    };

    const ok = editingId
      ? await updateItem(editingId, input)
      : await createItem(input);

    if (ok) handleCancel();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este item do portfólio?")) return;
    await deleteItem(id);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
          Portfólio {items.length > 0 && <span className="text-muted-foreground font-normal text-base">({items.length})</span>}
        </CardTitle>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={handleOpenCreate}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            Adicionar
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Formulário de criação/edição */}
        {showForm && (
          <Card className="border-primary/30 bg-muted/30">
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pf-title">Título *</Label>
                  <Input
                    id="pf-title"
                    placeholder="Ex: Sistema de Login"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={errors.title ? "border-destructive" : ""}
                    autoFocus
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pf-desc">Descrição</Label>
                  <Input
                    id="pf-desc"
                    placeholder="Breve descrição do projeto"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pf-url">Link do projeto</Label>
                  <Input
                    id="pf-url"
                    placeholder="https://github.com/..."
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    className={errors.url ? "border-destructive" : ""}
                  />
                  {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <Check className="mr-2 h-4 w-4" />
                    }
                    {editingId ? "Salvar alterações" : "Adicionar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={saving} className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de itens */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 && !showForm ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            Nenhum item no portfólio ainda. Clique em "Adicionar" para começar.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 bg-background"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver projeto
                    </a>
                  )}
                </div>

                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleOpenEdit(item)}
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                    title="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioEditor;
