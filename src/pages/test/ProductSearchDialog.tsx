import React from "react";
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
  if (!isVisible) return null;

  return (
    <Dialog title="Select Product" onClose={onClose} width={600} height={400}>
      <div style={{ padding: "10px" }}>
        <Grid
          data={products}
          style={{ height: "300px" }}
          dataItemKey="ProductID"
          sortable={true}
          filterable={true}
          pageable={true}
          defaultTake={5}
          onRowClick={(e) => onProductSelect(e.dataItem)}
        >
          <Column field="ProductID" title="ID" width="80px" />
          <Column field="ProductName" title="Product Name" width="250px" />
          <Column
            field="UnitPrice"
            title="Price"
            width="100px"
            format="{0:c}"
          />
        </Grid>
      </div>
      <DialogActionsBar>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActionsBar>
    </Dialog>
  );
};
