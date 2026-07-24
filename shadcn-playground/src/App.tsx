import { useMemo, useState } from "react";
import { demos, categories } from "./playground/registry";
import { Playground } from "./playground/Playground";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Search, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function App() {
  const [active, setActive] = useState(demos[0].slug);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return demos;
    return demos.filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
  }, [query]);

  const activeDemo = demos.find((d) => d.slug === active) ?? demos[0];

  return (
    <div className={cn("h-screen", dark && "dark")}>
      <div className="bg-background text-foreground flex h-screen">
        <aside className="border-border flex h-full w-72 shrink-0 flex-col border-r">
          <div className="border-border flex items-center justify-between border-b px-4 py-4">
            <div>
              <h1 className="text-sm font-semibold">shadcn/ui Playground</h1>
              <p className="text-muted-foreground text-xs">{demos.length} composants</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => setDark((d) => !d)} title="Basculer le thème">
              {dark ? <Sun /> : <Moon />}
            </Button>
          </div>
          <div className="border-border border-b p-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un composant..."
                className="pl-8"
              />
            </div>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto p-2">
            {categories.map((category) => {
              const items = filtered.filter((d) => d.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-3">
                  <p className="text-muted-foreground px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    {category}
                  </p>
                  {items.map((demo) => (
                    <button
                      key={demo.slug}
                      onClick={() => setActive(demo.slug)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        active === demo.slug
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent/50 text-foreground/80"
                      )}
                    >
                      {demo.name}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto p-8">
          <Playground demo={activeDemo} key={activeDemo.slug} />
        </main>
      </div>
    </div>
  );
}
