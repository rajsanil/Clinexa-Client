import { ReactNode } from 'react';

export type ActionType = 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'export' | 'import' | 'refresh' | 'view' | 'search' | 'custom';

export interface ActionBarAction {
  id: string;
  type: ActionType;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  hidden?: boolean;
  tooltip?: string;
}

export interface ActionBarConfig {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions: ActionBarAction[];
  leftActions?: ActionBarAction[];
  rightActions?: ActionBarAction[];
}

export interface ActionBarContextType {
  config: ActionBarConfig | null;
  setConfig: (config: ActionBarConfig | null) => void;
  updateAction: (actionId: string, updates: Partial<ActionBarAction>) => void;
  addAction: (action: ActionBarAction) => void;
  removeAction: (actionId: string) => void;
  clearActions: () => void;
} 