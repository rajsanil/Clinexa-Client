import {
  Grid,
  GridColumn as Column,
  GridItemChangeEvent,
  GridEditChangeEvent,
  GridCustomCellProps,
} from "@progress/kendo-react-grid";
import { useState } from "react";
import { EditDescriptor } from "@progress/kendo-react-data-tools";
import { ProductIDSearchEditCell, MyCustomEditCell } from "./ProductCell";
import { ProductSearchDialog } from "./ProductSearchDialog";

const Test = () => {
  const initialProducts = [
    {
      ProductID: 1,
      ProductName: "Chai",
      SupplierID: 1,
      CategoryID: 1,
      QuantityPerUnit: "10 boxes x 20 bags",
      UnitPrice: 18.0,
      UnitsInStock: 39,
      UnitsOnOrder: 0,
      ReorderLevel: 10,
      Discontinued: false,
      Category: {
        CategoryID: 1,
        CategoryName: "Beverages",
        Description: "Soft drinks, coffees, teas, beers, and ales",
      },
    },
    {
      ProductID: 2,
      ProductName: "Chang",
      SupplierID: 1,
      CategoryID: 1,
      QuantityPerUnit: "24 - 12 oz bottles",
      UnitPrice: 19.0,
      UnitsInStock: 17,
      UnitsOnOrder: 40,
      ReorderLevel: 25,
      Discontinued: false,
      Category: {
        CategoryID: 1,
        CategoryName: "Beverages",
        Description: "Soft drinks, coffees, teas, beers, and ales",
      },
    },
    {
      ProductID: 3,
      ProductName: "Aniseed Syrup",
      SupplierID: 1,
      CategoryID: 2,
      QuantityPerUnit: "12 - 550 ml bottles",
      UnitPrice: 10.0,
      UnitsInStock: 13,
      UnitsOnOrder: 70,
      ReorderLevel: 25,
      Discontinued: false,
      Category: {
        CategoryID: 2,
        CategoryName: "Condiments",
        Description:
          "Sweet and savory sauces, relishes, spreads, and seasonings",
      },
    },
    {
      ProductID: 4,
      ProductName: "Chef Anton's Cajun Seasoning",
      SupplierID: 2,
      CategoryID: 2,
      QuantityPerUnit: "48 - 6 oz jars",
      UnitPrice: 22.0,
      UnitsInStock: 53,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: false,
      Category: {
        CategoryID: 2,
        CategoryName: "Condiments",
        Description:
          "Sweet and savory sauces, relishes, spreads, and seasonings",
      },
    },
    {
      ProductID: 5,
      ProductName: "Chef Anton's Gumbo Mix",
      SupplierID: 2,
      CategoryID: 2,
      QuantityPerUnit: "36 boxes",
      UnitPrice: 21.35,
      UnitsInStock: 0,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: true,
      Category: {
        CategoryID: 2,
        CategoryName: "Condiments",
        Description:
          "Sweet and savory sauces, relishes, spreads, and seasonings",
      },
    },
  ];

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

  const [data, setData] = useState<Array<Product>>(initialProducts);
  const [edit, setEdit] = useState<EditDescriptor>({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentEditingProduct, setCurrentEditingProduct] =
    useState<Product | null>(null);

  const handleEditChange = (event: GridEditChangeEvent) => {
    setEdit(event.edit);
  };

  const handleItemChange = (event: GridItemChangeEvent) => {
    const newData = data.map((item) =>
      item.ProductID === event.dataItem.ProductID
        ? { ...item, [event.field!]: event.value }
        : item
    );
    setData(newData);
  };

  const handleOpenProductDialog = (product: Product) => {
    setCurrentEditingProduct(product);
    setDialogVisible(true);
  };

  const handleCloseProductDialog = () => {
    setDialogVisible(false);
    setCurrentEditingProduct(null);
  };

  const handleProductSelect = (selectedProduct: Product) => {
    if (currentEditingProduct) {
      const newData = data.map((item) =>
        item.ProductID === currentEditingProduct.ProductID
          ? selectedProduct
          : item
      );
      setData(newData);
      setEdit({});
    }
    handleCloseProductDialog();
  };

  return (
    <div>
      <Grid
        style={{ height: "475px" }}
        data={data}
        dataItemKey="ProductID"
        autoProcessData={true}
        sortable={true}
        pageable={true}
        filterable={true}
        editable={{ mode: "incell" }}
        defaultSkip={0}
        defaultTake={10}
        edit={edit}
        onEditChange={handleEditChange}
        onItemChange={handleItemChange}
        cells={{
          edit: {
            text: MyCustomEditCell,
            boolean: MyCustomEditCell,
            numeric: (props: GridCustomCellProps) => {
              if (props.field === "ProductID") {
                return (
                  <ProductIDSearchEditCell
                    {...props}
                    onOpenDialog={handleOpenProductDialog}
                  />
                );
              }
              return (
                <MyCustomEditCell {...props}>{props.children}</MyCustomEditCell>
              );
            },
          },
        }}
      >
        <Column field="ProductID" title="ID" width="140px" editor="numeric" />
        <Column field="ProductName" title="Name" editor="text" />
        <Column
          field="Category.CategoryName"
          title="Category"
          editable={false}
          width="200px"
        />
        <Column
          field="UnitPrice"
          title="Price"
          editor="numeric"
          width="150px"
        />
        <Column
          field="UnitsInStock"
          title="In stock"
          editor="numeric"
          width="150px"
        />
        <Column
          field="Discontinued"
          title="Discontinued"
          editor="boolean"
          width="150px"
        />
      </Grid>
      <ProductSearchDialog
        isVisible={dialogVisible}
        onClose={handleCloseProductDialog}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default Test;
