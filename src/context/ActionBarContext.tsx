import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  ActionBarConfig,
  ActionBarContextType,
  ActionBarAction,
} from "../types/actionbar.types";

const ActionBarContext = createContext<ActionBarContextType | undefined>(
  undefined
);

interface ActionBarProviderProps {
  children: ReactNode;
}

export const ActionBarProvider: React.FC<ActionBarProviderProps> = ({
  children,
}) => {
  const [config, setConfig] = useState<ActionBarConfig | null>(null);

  const updateAction = (
    actionId: string,
    updates: Partial<ActionBarAction>
  ) => {
    if (!config) return;

    setConfig((prevConfig) => {
      if (!prevConfig) return prevConfig;

      const updateActionsArray = (actions: ActionBarAction[]) =>
        actions.map((action) =>
          action.id === actionId ? { ...action, ...updates } : action
        );

      return {
        ...prevConfig,
        actions: updateActionsArray(prevConfig.actions),
        leftActions: prevConfig.leftActions
          ? updateActionsArray(prevConfig.leftActions)
          : undefined,
        rightActions: prevConfig.rightActions
          ? updateActionsArray(prevConfig.rightActions)
          : undefined,
      };
    });
  };

  const addAction = (action: ActionBarAction) => {
    if (!config) return;

    setConfig((prevConfig) => {
      if (!prevConfig) return prevConfig;

      return {
        ...prevConfig,
        actions: [...prevConfig.actions, action],
      };
    });
  };

  const removeAction = (actionId: string) => {
    if (!config) return;

    setConfig((prevConfig) => {
      if (!prevConfig) return prevConfig;

      const filterActions = (actions: ActionBarAction[]) =>
        actions.filter((action) => action.id !== actionId);

      return {
        ...prevConfig,
        actions: filterActions(prevConfig.actions),
        leftActions: prevConfig.leftActions
          ? filterActions(prevConfig.leftActions)
          : undefined,
        rightActions: prevConfig.rightActions
          ? filterActions(prevConfig.rightActions)
          : undefined,
      };
    });
  };

  const clearActions = () => {
    setConfig(null);
  };

  const value: ActionBarContextType = {
    config,
    setConfig,
    updateAction,
    addAction,
    removeAction,
    clearActions,
  };

  return (
    <ActionBarContext.Provider value={value}>
      {children}
    </ActionBarContext.Provider>
  );
};

export const useActionBar = (): ActionBarContextType => {
  const context = useContext(ActionBarContext);
  if (!context) {
    throw new Error("useActionBar must be used within an ActionBarProvider");
  }
  return context;
};
