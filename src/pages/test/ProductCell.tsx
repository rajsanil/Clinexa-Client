import React, { useEffect, useRef, SyntheticEvent } from "react";
import { GridCustomCellProps } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";

interface ProductCategory {
  CategoryID?: number;
  CategoryName?: string;
  Description?: string;
}

interface Product {
  ProductID: number;
  ProductName?: string;
  SupplierID?: number;
  CategoryID?: number;
  QuantityPerUnit?: string;
  UnitPrice?: number;
  UnitsInStock?: number;
  UnitsOnOrder?: number;
  ReorderLevel?: number;
  Discontinued?: boolean;
  Category?: ProductCategory;
  inEdit?: boolean | string;
}

interface ProductIDSearchEditCellProps extends GridCustomCellProps {
  onOpenDialog?: (product: Product) => void;
}

export const MyCustomEditCell = (props: GridCustomCellProps) => {
  const additionalProps = {
    ref: (td: HTMLTableCellElement | null) => {
      const input = td && td.querySelector("input");
      const activeElement = document.activeElement;
      if (
        !input ||
        !activeElement ||
        input === activeElement ||
        !activeElement.contains(input)
      ) {
        return;
      }
      if (input.type === "checkbox") {
        input.focus();
      }
    },
  };
  return (
    <td {...props.tdProps} {...additionalProps}>
      {props.children}
    </td>
  );
};

export const ProductIDSearchEditCell = (
  props: ProductIDSearchEditCellProps
) => {
  const { dataItem, field, onChange, onOpenDialog } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const value = field && dataItem[field] ? dataItem[field] : "";
      inputRef.current.value = value.toString();
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleInputBlur = () => {
    if (onChange && inputRef.current) {
      const event = {
        target: { value: inputRef.current.value },
        currentTarget: { value: inputRef.current.value },
        nativeEvent: new Event("blur"),
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
      } as unknown as SyntheticEvent;

      onChange({
        dataItem,
        dataIndex: 0,
        field: field!,
        syntheticEvent: event,
        value: inputRef.current.value,
      });
    }
  };

  const openDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDialog) {
      onOpenDialog(dataItem);
    }
  };

  return (
    <MyCustomEditCell {...props}>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          placeholder="Product ID"
        />
        <Button
          onMouseDown={openDialog}
          style={{
            height: "28px",
            width: "28px",
            minWidth: "28px",
            flexShrink: 0,
            pointerEvents: "auto",
            zIndex: 1000,
          }}
          title="Search Products"
        >
          🔍
        </Button>
      </div>
    </MyCustomEditCell>
  );
};
