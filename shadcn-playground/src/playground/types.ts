import type { ReactNode } from "react";

export type ControlType = "select" | "boolean" | "text" | "number";

export interface Control {
  key: string;
  label: string;
  type: ControlType;
  options?: string[];
  default: string | boolean | number;
  min?: number;
  max?: number;
}

export type ControlValues = Record<string, string | boolean | number>;

export interface ComponentDemo {
  slug: string;
  name: string;
  category: string;
  description: string;
  controls: Control[];
  render: (values: ControlValues) => ReactNode;
  code: (values: ControlValues) => string;
}
