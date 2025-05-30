import React, { useState } from "react";
import { GridCustomCellProps } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";

// Sample product data for the search dialog
const sampleProducts = [
  { ProductID: 1, ProductName: "Chai", UnitPrice: 18.0 },
  { ProductID: 2, ProductName: "Chang", UnitPrice: 19.0 },
  { ProductID: 3, ProductName: "Aniseed Syrup", UnitPrice: 10.0 },
  {
    ProductID: 4,
    ProductName: "Chef Anton's Cajun Seasoning",
    UnitPrice: 22.0,
  },
  { ProductID: 5, ProductName: "Chef Anton's Gumbo Mix", UnitPrice: 21.35 },
];

// Custom Edit Cell Wrapper (like MyCustomEditCell from the example)
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

// Your ProductID Search Edit Cell
export const ProductIDSearchEditCell = (props: GridCustomCellProps) => {
  const { dataItem, field, onChange } = props;
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleInputChange = (event: any) => {
    if (onChange) {
      onChange({
        dataItem,
        dataIndex: 0,
        field: field!,
        syntheticEvent: event.syntheticEvent,
        value: event.value,
      });
    }
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleProductSelect = (selectedProduct: any) => {
    if (onChange) {
      onChange({
        dataItem,
        dataIndex: 0,
        field: field!,
        syntheticEvent: {} as any,
        value: selectedProduct.ProductID,
      });
    }
    setDialogVisible(false);
  };

  return (
    <>
      <MyCustomEditCell {...props}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Input
            value={dataItem[field!] || ""}
            onChange={handleInputChange}
            style={{ flex: 1 }}
            placeholder="Product ID"
          />
          <Button
            icon="search"
            onClick={openDialog}
            size="small"
            style={{
              height: "28px",
              width: "28px",
              minWidth: "28px",
            }}
            title="Search Products"
          />
        </div>
      </MyCustomEditCell>

      {/* Search Dialog */}
      {dialogVisible && (
        <Dialog
          title="Select Product"
          onClose={handleDialogClose}
          width={600}
          height={400}
        >
          <div style={{ padding: "10px" }}>
            <Grid
              data={sampleProducts}
              style={{ height: "300px" }}
              dataItemKey="ProductID"
              sortable={true}
              filterable={true}
              pageable={true}
              defaultTake={5}
              onRowClick={(e) => handleProductSelect(e.dataItem)}
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
            <Button onClick={handleDialogClose}>Select</Button>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
};
