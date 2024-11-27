import { GridColDef, GridColumnVisibilityModel, GridSortItem } from "@mui/x-data-grid";

export type TypeSafeColDef<T> = GridColDef & { id: number, field: keyof T }
export type TypeSafeColVisibility<T> = GridColumnVisibilityModel & { [K in keyof Partial<T>]: boolean };
export type TypeSafeSortModel<T> = Array<GridSortItem & {'field': keyof T}>