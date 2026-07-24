import type { ComponentDemo, ControlValues } from "./types";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Bold,
  Home,
  Settings,
  User,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Terminal,
  AlertCircle,
} from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";

const bv = (v: ControlValues, key: string) => String(v[key]);
const bb = (v: ControlValues, key: string) => Boolean(v[key]);
const bt = (v: ControlValues, key: string) => String(v[key]);

export const demos: ComponentDemo[] = [
  // ---------- Inputs & Forms ----------
  {
    slug: "button",
    name: "Button",
    category: "Inputs & Forms",
    description: "Déclenche une action ou un événement.",
    controls: [
      { key: "variant", label: "variant", type: "select", options: ["default", "destructive", "outline", "secondary", "ghost", "link"], default: "default" },
      { key: "size", label: "size", type: "select", options: ["default", "xs", "sm", "lg", "icon"], default: "default" },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
      { key: "text", label: "label", type: "text", default: "Bouton" },
    ],
    render: (v) => (
      <Button variant={bv(v, "variant") as any} size={bv(v, "size") as any} disabled={bb(v, "disabled")}>
        {bt(v, "text")}
      </Button>
    ),
    code: (v) => `<Button variant="${bv(v, "variant")}" size="${bv(v, "size")}"${bb(v, "disabled") ? " disabled" : ""}>\n  ${bt(v, "text")}\n</Button>`,
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Inputs & Forms",
    description: "Affiche un petit statut ou compteur.",
    controls: [
      { key: "variant", label: "variant", type: "select", options: ["default", "secondary", "destructive", "outline", "ghost", "link"], default: "default" },
      { key: "text", label: "label", type: "text", default: "Badge" },
    ],
    render: (v) => <Badge variant={bv(v, "variant") as any}>{bt(v, "text")}</Badge>,
    code: (v) => `<Badge variant="${bv(v, "variant")}">${bt(v, "text")}</Badge>`,
  },
  {
    slug: "input",
    name: "Input",
    category: "Inputs & Forms",
    description: "Champ de saisie texte natif stylé.",
    controls: [
      { key: "placeholder", label: "placeholder", type: "text", default: "Adresse email" },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
      { key: "type", label: "type", type: "select", options: ["text", "email", "password", "number"], default: "email" },
    ],
    render: (v) => <Input type={bv(v, "type")} placeholder={bt(v, "placeholder")} disabled={bb(v, "disabled")} className="w-64" />,
    code: (v) => `<Input type="${bv(v, "type")}" placeholder="${bt(v, "placeholder")}"${bb(v, "disabled") ? " disabled" : ""} />`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Inputs & Forms",
    description: "Champ de saisie multi-lignes.",
    controls: [
      { key: "placeholder", label: "placeholder", type: "text", default: "Écris ton message..." },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
    ],
    render: (v) => <Textarea placeholder={bt(v, "placeholder")} disabled={bb(v, "disabled")} className="w-72" />,
    code: (v) => `<Textarea placeholder="${bt(v, "placeholder")}"${bb(v, "disabled") ? " disabled" : ""} />`,
  },
  {
    slug: "label",
    name: "Label",
    category: "Inputs & Forms",
    description: "Étiquette accessible pour un champ de formulaire.",
    controls: [{ key: "text", label: "label", type: "text", default: "Nom du projet" }],
    render: (v) => (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="demo-label-input">{bt(v, "text")}</Label>
        <Input id="demo-label-input" className="w-64" />
      </div>
    ),
    code: (v) => `<Label htmlFor="name">${bt(v, "text")}</Label>\n<Input id="name" />`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Inputs & Forms",
    description: "Case à cocher pour un choix binaire.",
    controls: [
      { key: "checked", label: "checked (défaut)", type: "boolean", default: true },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
      { key: "text", label: "label", type: "text", default: "Accepter les conditions" },
    ],
    render: (v) => (
      <div className="flex items-center gap-2">
        <Checkbox id="demo-checkbox" defaultChecked={bb(v, "checked")} disabled={bb(v, "disabled")} />
        <Label htmlFor="demo-checkbox">{bt(v, "text")}</Label>
      </div>
    ),
    code: (v) => `<Checkbox id="terms"${bb(v, "checked") ? " defaultChecked" : ""}${bb(v, "disabled") ? " disabled" : ""} />\n<Label htmlFor="terms">${bt(v, "text")}</Label>`,
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Inputs & Forms",
    description: "Interrupteur on/off.",
    controls: [
      { key: "checked", label: "checked (défaut)", type: "boolean", default: false },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
      { key: "text", label: "label", type: "text", default: "Notifications" },
    ],
    render: (v) => (
      <div className="flex items-center gap-2">
        <Switch id="demo-switch" defaultChecked={bb(v, "checked")} disabled={bb(v, "disabled")} />
        <Label htmlFor="demo-switch">{bt(v, "text")}</Label>
      </div>
    ),
    code: (v) => `<Switch id="notif"${bb(v, "checked") ? " defaultChecked" : ""}${bb(v, "disabled") ? " disabled" : ""} />\n<Label htmlFor="notif">${bt(v, "text")}</Label>`,
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    category: "Inputs & Forms",
    description: "Groupe de choix exclusifs.",
    controls: [{ key: "disabled", label: "disabled", type: "boolean", default: false }],
    render: (v) => (
      <RadioGroup defaultValue="comfortable" disabled={bb(v, "disabled")} className="gap-3">
        {["default", "comfortable", "compact"].map((val) => (
          <div key={val} className="flex items-center gap-2">
            <RadioGroupItem value={val} id={`r-${val}`} />
            <Label htmlFor={`r-${val}`}>{val}</Label>
          </div>
        ))}
      </RadioGroup>
    ),
    code: () => `<RadioGroup defaultValue="comfortable">\n  <RadioGroupItem value="default" id="r1" />\n  <Label htmlFor="r1">default</Label>\n  ...\n</RadioGroup>`,
  },
  {
    slug: "select",
    name: "Select",
    category: "Inputs & Forms",
    description: "Menu déroulant pour choisir une valeur.",
    controls: [{ key: "disabled", label: "disabled", type: "boolean", default: false }],
    render: (v) => (
      <Select disabled={bb(v, "disabled")} defaultValue="kanban">
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Choisir une vue" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kanban">Kanban</SelectItem>
          <SelectItem value="sprints">Sprints</SelectItem>
          <SelectItem value="calendrier">Calendrier</SelectItem>
        </SelectContent>
      </Select>
    ),
    code: (v) => `<Select${bb(v, "disabled") ? " disabled" : ""} defaultValue="kanban">\n  <SelectTrigger className="w-48">\n    <SelectValue placeholder="Choisir une vue" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="kanban">Kanban</SelectItem>\n    <SelectItem value="sprints">Sprints</SelectItem>\n  </SelectContent>\n</Select>`,
  },
  {
    slug: "native-select",
    name: "Native Select",
    category: "Inputs & Forms",
    description: "Select HTML natif stylé (utile en contexte mobile/formulaire).",
    controls: [{ key: "disabled", label: "disabled", type: "boolean", default: false }],
    render: (v) => (
      <NativeSelect disabled={bb(v, "disabled")} className="w-48" defaultValue="fr">
        <NativeSelectOption value="fr">Français</NativeSelectOption>
        <NativeSelectOption value="en">English</NativeSelectOption>
      </NativeSelect>
    ),
    code: (v) => `<NativeSelect${bb(v, "disabled") ? " disabled" : ""} defaultValue="fr">\n  <NativeSelectOption value="fr">Français</NativeSelectOption>\n  <NativeSelectOption value="en">English</NativeSelectOption>\n</NativeSelect>`,
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Inputs & Forms",
    description: "Sélection d'une valeur numérique sur une plage.",
    controls: [
      { key: "min", label: "min", type: "number", default: 0 },
      { key: "max", label: "max", type: "number", default: 100 },
      { key: "step", label: "step", type: "number", default: 1 },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
    ],
    render: (v) => (
      <Slider
        defaultValue={[50]}
        min={Number(v.min)}
        max={Number(v.max)}
        step={Number(v.step)}
        disabled={bb(v, "disabled")}
        className="w-64"
      />
    ),
    code: (v) => `<Slider defaultValue={[50]} min={${v.min}} max={${v.max}} step={${v.step}}${bb(v, "disabled") ? " disabled" : ""} />`,
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Inputs & Forms",
    description: "Bouton à deux états (pressé / non pressé).",
    controls: [
      { key: "variant", label: "variant", type: "select", options: ["default", "outline"], default: "default" },
      { key: "size", label: "size", type: "select", options: ["default", "sm", "lg"], default: "default" },
      { key: "disabled", label: "disabled", type: "boolean", default: false },
    ],
    render: (v) => (
      <Toggle variant={bv(v, "variant") as any} size={bv(v, "size") as any} disabled={bb(v, "disabled")} aria-label="Gras">
        <Bold />
      </Toggle>
    ),
    code: (v) => `<Toggle variant="${bv(v, "variant")}" size="${bv(v, "size")}"${bb(v, "disabled") ? " disabled" : ""} aria-label="Gras">\n  <Bold />\n</Toggle>`,
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    category: "Inputs & Forms",
    description: "Groupe de toggles, sélection simple ou multiple.",
    controls: [
      { key: "type", label: "type", type: "select", options: ["single", "multiple"], default: "single" },
      { key: "variant", label: "variant", type: "select", options: ["default", "outline"], default: "default" },
    ],
    render: (v) => (
      <ToggleGroup type={bv(v, "type") as any} variant={bv(v, "variant") as any} defaultValue={(bv(v, "type") === "single" ? "left" : ["left"]) as any}>
        <ToggleGroupItem value="left" aria-label="Aligner à gauche"><AlignLeft /></ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Centrer"><AlignCenter /></ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Aligner à droite"><AlignRight /></ToggleGroupItem>
      </ToggleGroup>
    ),
    code: (v) => `<ToggleGroup type="${bv(v, "type")}" variant="${bv(v, "variant")}">\n  <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>\n  <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>\n  <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>\n</ToggleGroup>`,
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    category: "Inputs & Forms",
    description: "Saisie de code à usage unique.",
    controls: [{ key: "length", label: "nombre de cases", type: "number", default: 6, min: 4, max: 8 }],
    render: (v) => {
      const len = Number(v.length);
      return (
        <InputOTP maxLength={len}>
          <InputOTPGroup>
            {Array.from({ length: len }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      );
    },
    code: (v) => `<InputOTP maxLength={${v.length}}>\n  <InputOTPGroup>\n    {/* ${v.length} <InputOTPSlot index={i} /> */}\n  </InputOTPGroup>\n</InputOTP>`,
  },
  {
    slug: "input-group",
    name: "Input Group",
    category: "Inputs & Forms",
    description: "Input avec icônes ou boutons accolés.",
    controls: [{ key: "placeholder", label: "placeholder", type: "text", default: "Rechercher..." }],
    render: (v) => (
      <InputGroup className="w-72">
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder={bt(v, "placeholder")} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs">⏎</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    ),
    code: (v) => `<InputGroup>\n  <InputGroupAddon><Search /></InputGroupAddon>\n  <InputGroupInput placeholder="${bt(v, "placeholder")}" />\n</InputGroup>`,
  },
  {
    slug: "field",
    name: "Field",
    category: "Inputs & Forms",
    description: "Bloc de champ de formulaire (label, description, control).",
    controls: [
      { key: "label", label: "label", type: "text", default: "Nom du projet" },
      { key: "description", label: "description", type: "text", default: "Visible par toute l'équipe." },
    ],
    render: (v) => (
      <FieldGroup className="w-72">
        <Field>
          <FieldLabel htmlFor="field-demo">{bt(v, "label")}</FieldLabel>
          <Input id="field-demo" />
          <FieldDescription>{bt(v, "description")}</FieldDescription>
        </Field>
      </FieldGroup>
    ),
    code: (v) => `<Field>\n  <FieldLabel htmlFor="name">${bt(v, "label")}</FieldLabel>\n  <Input id="name" />\n  <FieldDescription>${bt(v, "description")}</FieldDescription>\n</Field>`,
  },
  {
    slug: "form",
    name: "Form",
    category: "Inputs & Forms",
    description: "Intégration react-hook-form + zod (voir le code source pour le schéma complet).",
    controls: [],
    render: () => (
      <div className="flex w-72 flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="form-demo-username">Nom d'utilisateur</FieldLabel>
          <Input id="form-demo-username" placeholder="ex: quentin" />
          <FieldDescription>Ceci est ton nom public.</FieldDescription>
        </Field>
        <Button type="submit" className="w-fit">Envoyer</Button>
      </div>
    ),
    code: () => `const form = useForm({ resolver: zodResolver(schema) })\n\n<Form {...form}>\n  <form onSubmit={form.handleSubmit(onSubmit)}>\n    <FormField name="username" render={({ field }) => (\n      <FormItem>\n        <FormLabel>Nom d'utilisateur</FormLabel>\n        <FormControl><Input {...field} /></FormControl>\n        <FormMessage />\n      </FormItem>\n    )} />\n  </form>\n</Form>`,
  },

  // ---------- Layout & Display ----------
  {
    slug: "card",
    name: "Card",
    category: "Layout & Display",
    description: "Conteneur pour regrouper du contenu associé.",
    controls: [
      { key: "title", label: "titre", type: "text", default: "Sprint 12" },
      { key: "description", label: "description", type: "text", default: "12 tâches, échéance vendredi." },
    ],
    render: (v) => (
      <Card className="w-72">
        <CardHeader>
          <CardTitle>{bt(v, "title")}</CardTitle>
          <CardDescription>{bt(v, "description")}</CardDescription>
        </CardHeader>
        <CardContent><p className="text-sm">Contenu de la carte.</p></CardContent>
        <CardFooter><Button size="sm">Voir</Button></CardFooter>
      </Card>
    ),
    code: (v) => `<Card>\n  <CardHeader>\n    <CardTitle>${bt(v, "title")}</CardTitle>\n    <CardDescription>${bt(v, "description")}</CardDescription>\n  </CardHeader>\n  <CardContent>...</CardContent>\n  <CardFooter><Button size="sm">Voir</Button></CardFooter>\n</Card>`,
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Layout & Display",
    description: "Ligne de séparation horizontale ou verticale.",
    controls: [{ key: "orientation", label: "orientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" }],
    render: (v) => (
      <div className={bv(v, "orientation") === "vertical" ? "flex h-16 items-center gap-4" : "w-64"}>
        <span className="text-sm">Kanban</span>
        <Separator orientation={bv(v, "orientation") as any} className={bv(v, "orientation") === "horizontal" ? "my-3" : ""} />
        <span className="text-sm">Sprints</span>
      </div>
    ),
    code: (v) => `<Separator orientation="${bv(v, "orientation")}" />`,
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    category: "Layout & Display",
    description: "Contraint un élément à un ratio largeur/hauteur fixe.",
    controls: [{ key: "ratio", label: "ratio", type: "select", options: ["16 / 9", "1 / 1", "4 / 3"], default: "16 / 9" }],
    render: (v) => {
      const ratio = bv(v, "ratio").split(" / ").map(Number);
      return (
        <AspectRatio ratio={ratio[0] / ratio[1]} className="bg-muted flex w-72 items-center justify-center rounded-md">
          <span className="text-muted-foreground text-sm">{bv(v, "ratio")}</span>
        </AspectRatio>
      );
    },
    code: (v) => `<AspectRatio ratio={${v.ratio}}>\n  <img src="..." className="rounded-md object-cover" />\n</AspectRatio>`,
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Layout & Display",
    description: "Représentation visuelle d'un utilisateur.",
    controls: [
      { key: "src", label: "image src", type: "text", default: "" },
      { key: "fallback", label: "fallback", type: "text", default: "QF" },
    ],
    render: (v) => (
      <Avatar>
        <AvatarImage src={bt(v, "src") || undefined} alt="avatar" />
        <AvatarFallback>{bt(v, "fallback")}</AvatarFallback>
      </Avatar>
    ),
    code: (v) => `<Avatar>\n  <AvatarImage src="${bt(v, "src")}" />\n  <AvatarFallback>${bt(v, "fallback")}</AvatarFallback>\n</Avatar>`,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Layout & Display",
    description: "Placeholder de chargement.",
    controls: [
      { key: "width", label: "largeur (px)", type: "number", default: 200 },
      { key: "height", label: "hauteur (px)", type: "number", default: 20 },
    ],
    render: (v) => <Skeleton style={{ width: Number(v.width), height: Number(v.height) }} />,
    code: (v) => `<Skeleton style={{ width: ${v.width}, height: ${v.height} }} />`,
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Layout & Display",
    description: "Indicateur de chargement animé.",
    controls: [],
    render: () => <Spinner />,
    code: () => `<Spinner />`,
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Layout & Display",
    description: "Barre de progression déterminée.",
    controls: [{ key: "value", label: "value", type: "number", default: 60, min: 0, max: 100 }],
    render: (v) => <Progress value={Number(v.value)} className="w-64" />,
    code: (v) => `<Progress value={${v.value}} />`,
  },
  {
    slug: "table",
    name: "Table",
    category: "Layout & Display",
    description: "Tableau de données simple.",
    controls: [],
    render: () => (
      <Table>
        <TableCaption>Liste des tâches du sprint.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tâche</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Priorité</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[["Wireframes", "En cours", "Haute"], ["Design final", "À faire", "Moyenne"]].map((row) => (
            <TableRow key={row[0]}>
              <TableCell>{row[0]}</TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell className="text-right">{row[2]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    code: () => `<Table>\n  <TableHeader>\n    <TableRow><TableHead>Tâche</TableHead><TableHead>Statut</TableHead></TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow><TableCell>Wireframes</TableCell><TableCell>En cours</TableCell></TableRow>\n  </TableBody>\n</Table>`,
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "Layout & Display",
    description: "Affiche une combinaison de touches clavier.",
    controls: [],
    render: () => (
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    ),
    code: () => `<KbdGroup>\n  <Kbd>Ctrl</Kbd>\n  <Kbd>K</Kbd>\n</KbdGroup>`,
  },
  {
    slug: "item",
    name: "Item",
    category: "Layout & Display",
    description: "Ligne composite (avatar/icône + titre + description + actions).",
    controls: [{ key: "variant", label: "variant", type: "select", options: ["default", "outline", "muted"], default: "outline" }],
    render: (v) => (
      <Item variant={bv(v, "variant") as any} className="w-80">
        <ItemMedia><User className="size-5" /></ItemMedia>
        <ItemContent>
          <ItemTitle>Quentin Feret</ItemTitle>
          <ItemDescription>Product Designer</ItemDescription>
        </ItemContent>
      </Item>
    ),
    code: (v) => `<Item variant="${bv(v, "variant")}">\n  <ItemMedia><User /></ItemMedia>\n  <ItemContent>\n    <ItemTitle>Quentin Feret</ItemTitle>\n    <ItemDescription>Product Designer</ItemDescription>\n  </ItemContent>\n</Item>`,
  },
  {
    slug: "empty",
    name: "Empty",
    category: "Layout & Display",
    description: "État vide (aucune donnée à afficher).",
    controls: [
      { key: "title", label: "titre", type: "text", default: "Aucune tâche" },
      { key: "description", label: "description", type: "text", default: "Crée ta première tâche pour commencer." },
    ],
    render: (v) => (
      <Empty className="w-80">
        <EmptyHeader>
          <EmptyMedia variant="icon"><AlertCircle /></EmptyMedia>
          <EmptyTitle>{bt(v, "title")}</EmptyTitle>
          <EmptyDescription>{bt(v, "description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button size="sm"><Plus /> Nouvelle tâche</Button></EmptyContent>
      </Empty>
    ),
    code: (v) => `<Empty>\n  <EmptyHeader>\n    <EmptyMedia variant="icon"><AlertCircle /></EmptyMedia>\n    <EmptyTitle>${bt(v, "title")}</EmptyTitle>\n    <EmptyDescription>${bt(v, "description")}</EmptyDescription>\n  </EmptyHeader>\n</Empty>`,
  },
  {
    slug: "button-group",
    name: "Button Group",
    category: "Layout & Display",
    description: "Regroupe plusieurs boutons visuellement.",
    controls: [],
    render: () => (
      <ButtonGroup>
        <Button variant="outline">Jour</Button>
        <Button variant="outline">Semaine</Button>
        <Button variant="outline">Mois</Button>
      </ButtonGroup>
    ),
    code: () => `<ButtonGroup>\n  <Button variant="outline">Jour</Button>\n  <Button variant="outline">Semaine</Button>\n  <Button variant="outline">Mois</Button>\n</ButtonGroup>`,
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    category: "Layout & Display",
    description: "Zone défilable avec scrollbar stylée.",
    controls: [],
    render: () => (
      <ScrollArea className="border-border h-32 w-56 rounded-md border p-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <p key={i} className="text-sm">Élément {i + 1}</p>
        ))}
      </ScrollArea>
    ),
    code: () => `<ScrollArea className="h-32 w-56 rounded-md border">\n  {items.map((item) => <p key={item.id}>{item.label}</p>)}\n</ScrollArea>`,
  },
  {
    slug: "resizable",
    name: "Resizable",
    category: "Layout & Display",
    description: "Panneaux redimensionnables par glissement.",
    controls: [],
    render: () => (
      <ResizablePanelGroup orientation="horizontal" className="border-border h-32 w-72 rounded-md border">
        <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-sm">Panneau 1</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-sm">Panneau 2</div></ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: () => `<ResizablePanelGroup orientation="horizontal">\n  <ResizablePanel defaultSize={50}>Panneau 1</ResizablePanel>\n  <ResizableHandle withHandle />\n  <ResizablePanel defaultSize={50}>Panneau 2</ResizablePanel>\n</ResizablePanelGroup>`,
  },
  {
    slug: "carousel",
    name: "Carousel",
    category: "Layout & Display",
    description: "Défilement horizontal d'éléments (embla-carousel).",
    controls: [],
    render: () => (
      <Carousel className="w-64">
        <CarouselContent>
          {[1, 2, 3].map((i) => (
            <CarouselItem key={i}>
              <div className="bg-muted flex h-32 items-center justify-center rounded-md text-2xl font-semibold">{i}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ),
    code: () => `<Carousel>\n  <CarouselContent>\n    <CarouselItem>...</CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious />\n  <CarouselNext />\n</Carousel>`,
  },
  {
    slug: "calendar",
    name: "Calendar",
    category: "Layout & Display",
    description: "Sélecteur de date (react-day-picker).",
    controls: [],
    render: () => <Calendar mode="single" className="rounded-md border" />,
    code: () => `<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />`,
  },
  {
    slug: "chart",
    name: "Chart",
    category: "Layout & Display",
    description: "Wrapper recharts thémé pour les graphiques.",
    controls: [],
    render: () => {
      const data = [
        { name: "Lun", tasks: 4 },
        { name: "Mar", tasks: 7 },
        { name: "Mer", tasks: 5 },
        { name: "Jeu", tasks: 9 },
      ];
      return (
        <ChartContainer config={{ tasks: { label: "Tâches", color: "var(--chart-1)" } }} className="h-40 w-72">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      );
    },
    code: () => `<ChartContainer config={chartConfig}>\n  <BarChart data={data}>\n    <XAxis dataKey="name" />\n    <Bar dataKey="tasks" fill="var(--color-tasks)" />\n    <ChartTooltip content={<ChartTooltipContent />} />\n  </BarChart>\n</ChartContainer>`,
  },

  // ---------- Navigation ----------
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Bascule entre plusieurs vues de contenu.",
    controls: [],
    render: () => (
      <Tabs defaultValue="kanban" className="w-72">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="text-sm">Vue Kanban.</TabsContent>
        <TabsContent value="sprints" className="text-sm">Vue Sprints.</TabsContent>
      </Tabs>
    ),
    code: () => `<Tabs defaultValue="kanban">\n  <TabsList>\n    <TabsTrigger value="kanban">Kanban</TabsTrigger>\n    <TabsTrigger value="sprints">Sprints</TabsTrigger>\n  </TabsList>\n  <TabsContent value="kanban">...</TabsContent>\n</Tabs>`,
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    description: "Fil d'ariane pour la hiérarchie de navigation.",
    controls: [],
    render: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Projets</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Le Studio</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Sprint 12</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: () => `<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/projets">Projets</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Sprint 12</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`,
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "Navigation",
    description: "Navigue entre plusieurs pages de résultats.",
    controls: [],
    render: () => (
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationEllipsis /></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    code: () => `<Pagination>\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationNext href="#" /></PaginationItem>\n  </PaginationContent>\n</Pagination>`,
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    category: "Navigation",
    description: "Menu de navigation principal avec sous-menus.",
    controls: [],
    render: () => (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Projets</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#" className="block w-40 p-2 text-sm">Le Studio</NavigationMenuLink>
              <NavigationMenuLink href="#" className="block w-40 p-2 text-sm">Archives</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    code: () => `<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Projets</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <NavigationMenuLink href="#">Le Studio</NavigationMenuLink>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>`,
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "Navigation",
    description: "Barre latérale de navigation complète et composable.",
    controls: [],
    render: () => (
      <SidebarProvider className="border-border !min-h-0 h-72 w-72 overflow-hidden rounded-md border">
        <Sidebar collapsible="none" className="h-full">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">Le Studio</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Vues</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home /> Kanban
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Terminal /> Sprints
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
    code: () => `<SidebarProvider>\n  <Sidebar>\n    <SidebarHeader>Le Studio</SidebarHeader>\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>Vues</SidebarGroupLabel>\n        <SidebarGroupContent>\n          <SidebarMenu>\n            <SidebarMenuItem>\n              <SidebarMenuButton isActive>Kanban</SidebarMenuButton>\n            </SidebarMenuItem>\n          </SidebarMenu>\n        </SidebarGroupContent>\n      </SidebarGroup>\n    </SidebarContent>\n  </Sidebar>\n</SidebarProvider>`,
  },
  {
    slug: "menubar",
    name: "Menubar",
    category: "Navigation",
    description: "Barre de menus façon application desktop.",
    controls: [],
    render: () => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Fichier</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Nouveau <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exporter</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    code: () => `<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>Fichier</MenubarTrigger>\n    <MenubarContent>\n      <MenubarItem>Nouveau <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>`,
  },

  // ---------- Overlays & Popups ----------
  {
    slug: "dialog",
    name: "Dialog",
    category: "Overlays & Popups",
    description: "Boîte de dialogue modale.",
    controls: [{ key: "title", label: "titre", type: "text", default: "Modifier la tâche" }],
    render: (v) => (
      <Dialog>
        <DialogTrigger asChild><Button variant="outline">Ouvrir</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{bt(v, "title")}</DialogTitle>
            <DialogDescription>Modifie les informations puis enregistre.</DialogDescription>
          </DialogHeader>
          <DialogFooter><Button type="submit">Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: (v) => `<Dialog>\n  <DialogTrigger asChild><Button variant="outline">Ouvrir</Button></DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>${bt(v, "title")}</DialogTitle>\n      <DialogDescription>...</DialogDescription>\n    </DialogHeader>\n    <DialogFooter><Button type="submit">Enregistrer</Button></DialogFooter>\n  </DialogContent>\n</Dialog>`,
  },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    category: "Overlays & Popups",
    description: "Dialogue de confirmation bloquant pour actions sensibles.",
    controls: [{ key: "title", label: "titre", type: "text", default: "Supprimer la tâche ?" }],
    render: (v) => (
      <AlertDialog>
        <AlertDialogTrigger asChild><Button variant="destructive">Supprimer</Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{bt(v, "title")}</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: (v) => `<AlertDialog>\n  <AlertDialogTrigger asChild><Button variant="destructive">Supprimer</Button></AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>${bt(v, "title")}</AlertDialogTitle>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Annuler</AlertDialogCancel>\n      <AlertDialogAction>Confirmer</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`,
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "Overlays & Popups",
    description: "Panneau latéral glissant.",
    controls: [{ key: "side", label: "side", type: "select", options: ["right", "left", "top", "bottom"], default: "right" }],
    render: (v) => (
      <Sheet>
        <SheetTrigger asChild><Button variant="outline">Ouvrir</Button></SheetTrigger>
        <SheetContent side={bv(v, "side") as any}>
          <SheetHeader>
            <SheetTitle>Détail de la tâche</SheetTitle>
            <SheetDescription>Informations complètes et sous-tâches.</SheetDescription>
          </SheetHeader>
          <SheetFooter><Button>Fermer</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    ),
    code: (v) => `<Sheet>\n  <SheetTrigger asChild><Button variant="outline">Ouvrir</Button></SheetTrigger>\n  <SheetContent side="${bv(v, "side")}">\n    <SheetHeader>\n      <SheetTitle>Détail de la tâche</SheetTitle>\n    </SheetHeader>\n  </SheetContent>\n</Sheet>`,
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "Overlays & Popups",
    description: "Tiroir glissant (vaul), adapté au mobile.",
    controls: [],
    render: () => (
      <Drawer>
        <DrawerTrigger asChild><Button variant="outline">Ouvrir</Button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtrer les tâches</DrawerTitle>
            <DrawerDescription>Choisis un designer et un projet.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter><DrawerClose asChild><Button variant="outline">Fermer</Button></DrawerClose></DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
    code: () => `<Drawer>\n  <DrawerTrigger asChild><Button variant="outline">Ouvrir</Button></DrawerTrigger>\n  <DrawerContent>\n    <DrawerHeader><DrawerTitle>Filtrer les tâches</DrawerTitle></DrawerHeader>\n  </DrawerContent>\n</Drawer>`,
  },
  {
    slug: "popover",
    name: "Popover",
    category: "Overlays & Popups",
    description: "Contenu flottant déclenché par un clic.",
    controls: [],
    render: () => (
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Ouvrir</Button></PopoverTrigger>
        <PopoverContent className="w-64 text-sm">Contenu du popover, positionné automatiquement.</PopoverContent>
      </Popover>
    ),
    code: () => `<Popover>\n  <PopoverTrigger asChild><Button variant="outline">Ouvrir</Button></PopoverTrigger>\n  <PopoverContent>Contenu...</PopoverContent>\n</Popover>`,
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    category: "Overlays & Popups",
    description: "Prévisualisation au survol.",
    controls: [],
    render: () => (
      <HoverCard>
        <HoverCardTrigger asChild><Button variant="link">@quentinferet</Button></HoverCardTrigger>
        <HoverCardContent className="w-64 text-sm">Quentin Feret — Product Designer, Le Studio.</HoverCardContent>
      </HoverCard>
    ),
    code: () => `<HoverCard>\n  <HoverCardTrigger asChild><Button variant="link">@quentinferet</Button></HoverCardTrigger>\n  <HoverCardContent>...</HoverCardContent>\n</HoverCard>`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Overlays & Popups",
    description: "Info-bulle au survol/focus.",
    controls: [{ key: "text", label: "texte", type: "text", default: "Ajouter une tâche" }],
    render: (v) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild><Button variant="outline" size="icon"><Plus /></Button></TooltipTrigger>
          <TooltipContent>{bt(v, "text")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    code: (v) => `<Tooltip>\n  <TooltipTrigger asChild><Button variant="outline" size="icon"><Plus /></Button></TooltipTrigger>\n  <TooltipContent>${bt(v, "text")}</TooltipContent>\n</Tooltip>`,
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    category: "Overlays & Popups",
    description: "Menu contextuel déclenché par un clic.",
    controls: [],
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Tâche</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Settings /> Modifier</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    code: () => `<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Modifier</DropdownMenuItem>\n    <DropdownMenuItem variant="destructive">Supprimer</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    category: "Overlays & Popups",
    description: "Menu déclenché par un clic droit.",
    controls: [],
    render: () => (
      <ContextMenu>
        <ContextMenuTrigger className="border-border flex h-24 w-56 items-center justify-center rounded-md border border-dashed text-sm">
          Clic droit ici
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Modifier</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Supprimer</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
    code: () => `<ContextMenu>\n  <ContextMenuTrigger>Clic droit ici</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Modifier</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>`,
  },
  {
    slug: "command",
    name: "Command",
    category: "Overlays & Popups",
    description: "Palette de commandes avec recherche (cmdk).",
    controls: [],
    render: () => (
      <Command className="border-border w-72 rounded-md border">
        <CommandInput placeholder="Rechercher une commande..." />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup heading="Vues">
            <CommandItem><Home /> Kanban</CommandItem>
            <CommandItem><Terminal /> Sprints</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Compte">
            <CommandItem><User /> Profil</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: () => `<Command>\n  <CommandInput placeholder="Rechercher..." />\n  <CommandList>\n    <CommandEmpty>Aucun résultat.</CommandEmpty>\n    <CommandGroup heading="Vues">\n      <CommandItem>Kanban</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`,
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    category: "Overlays & Popups",
    description: "Section repliable/dépliable.",
    controls: [],
    render: () => (
      <Collapsible className="w-64">
        <CollapsibleTrigger asChild><Button variant="outline" size="sm">Sous-tâches (3)</Button></CollapsibleTrigger>
        <CollapsibleContent className="mt-2 flex flex-col gap-1 text-sm">
          <p>Wireframes</p>
          <p>Maquette finale</p>
          <p>Tests utilisateurs</p>
        </CollapsibleContent>
      </Collapsible>
    ),
    code: () => `<Collapsible>\n  <CollapsibleTrigger asChild><Button variant="outline">Sous-tâches</Button></CollapsibleTrigger>\n  <CollapsibleContent>...</CollapsibleContent>\n</Collapsible>`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Overlays & Popups",
    description: "Liste de sections repliables, une ou plusieurs ouvertes.",
    controls: [{ key: "type", label: "type", type: "select", options: ["single", "multiple"], default: "single" }],
    render: (v) => (
      <Accordion type={bv(v, "type") as any} collapsible={bv(v, "type") === "single" ? true : undefined} className="w-72">
        <AccordionItem value="item-1">
          <AccordionTrigger>Qu'est-ce qu'un sprint ?</AccordionTrigger>
          <AccordionContent>Une période fixe de travail, généralement 2 semaines.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Comment assigner une tâche ?</AccordionTrigger>
          <AccordionContent>Ouvre la tâche puis choisis un designer.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: (v) => `<Accordion type="${bv(v, "type")}"${bv(v, "type") === "single" ? " collapsible" : ""}>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Qu'est-ce qu'un sprint ?</AccordionTrigger>\n    <AccordionContent>...</AccordionContent>\n  </AccordionItem>\n</Accordion>`,
  },

  // ---------- Feedback ----------
  {
    slug: "alert",
    name: "Alert",
    category: "Feedback",
    description: "Message contextuel court (info, erreur, etc.).",
    controls: [
      { key: "variant", label: "variant", type: "select", options: ["default", "destructive"], default: "default" },
      { key: "title", label: "titre", type: "text", default: "Attention" },
      { key: "description", label: "description", type: "text", default: "Vérifie les dates avant de publier le sprint." },
    ],
    render: (v) => (
      <Alert variant={bv(v, "variant") as any} className="w-80">
        <AlertCircle className="size-4" />
        <AlertTitle>{bt(v, "title")}</AlertTitle>
        <AlertDescription>{bt(v, "description")}</AlertDescription>
      </Alert>
    ),
    code: (v) => `<Alert variant="${bv(v, "variant")}">\n  <AlertCircle className="size-4" />\n  <AlertTitle>${bt(v, "title")}</AlertTitle>\n  <AlertDescription>${bt(v, "description")}</AlertDescription>\n</Alert>`,
  },
  {
    slug: "sonner",
    name: "Sonner (Toast)",
    category: "Feedback",
    description: "Notifications toast empilées.",
    controls: [
      { key: "type", label: "type", type: "select", options: ["default", "success", "error", "info"], default: "success" },
      { key: "message", label: "message", type: "text", default: "Tâche enregistrée" },
    ],
    render: (v) => (
      <>
        <Button
          variant="outline"
          onClick={() => {
            const type = bv(v, "type");
            const msg = bt(v, "message");
            if (type === "success") toast.success(msg);
            else if (type === "error") toast.error(msg);
            else if (type === "info") toast.info(msg);
            else toast(msg);
          }}
        >
          Afficher le toast
        </Button>
        <Toaster />
      </>
    ),
    code: (v) => `toast${bv(v, "type") !== "default" ? `.${bv(v, "type")}` : ""}("${bt(v, "message")}")`,
  },
];

export const categories = Array.from(new Set(demos.map((d) => d.category)));
