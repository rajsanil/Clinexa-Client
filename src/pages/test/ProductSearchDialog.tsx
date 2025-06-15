import React, { useEffect, useRef } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { products } from "./product";

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
  Category?: {
    CategoryID?: number;
    CategoryName?: string;
    Description?: string;
  };
}

interface ProductSearchDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

export const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  isVisible,
  onClose,
  onProductSelect,
}) => {
  const gridRef = useRef<any>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
 
        const filterInput = dialogRef.current?.querySelector(
          '.k-filtercell input, .k-filter-row input, input[data-role="numerictextbox"], .k-textbox, .k-grid-filter-row input'
        );
        if (filterInput instanceof HTMLInputElement) {
          filterInput.focus();
          filterInput.select();
        }
      }, 300); 

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Dialog title="Select Product" onClose={handleClose} width={800}>
      <div ref={dialogRef} style={{ padding: "10px" }}>
        <Grid
          ref={gridRef}
          data={products}
          style={{ height: "400px" }}
          dataItemKey="ProductID"
          sortable={true}
          filterable={true}
          pageable={true}
          defaultTake={10}
          onRowClick={(e) => onProductSelect(e.dataItem)}
        >
          <Column field="ProductID" title="ID" width="180px" filter="numeric" />
          <Column field="ProductName" title="Product Name" filter="text" />
          <Column
            field="UnitPrice"
            title="Price"
            format="{0:c}"
            width="180px"
            filter="numeric"
          />
        </Grid>
      </div>
      <DialogActionsBar>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActionsBar>
    </Dialog>
  );
};
