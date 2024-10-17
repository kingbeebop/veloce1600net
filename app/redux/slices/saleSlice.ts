import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sale } from '../../types/sale';
import { saveSale as saveSaleAPI, updateSale as updateSaleAPI} from '../../utils/api';

interface SaleState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SaleState = {
  sales: [],
  loading: false,
  error: null,
};

// Thunks for sales
export const saveSale = createAsyncThunk<Sale, Sale>(
  'sales/saveSale',
  async (saleData) => {
    const response = await saveSaleAPI(saleData);
    return response;
  }
);

export const updateSale = createAsyncThunk<Sale, { id: number, saleData: Partial<Sale> }>(
  'sales/updateSale',
  async ({ id, saleData }) => {
    const response = await updateSaleAPI(id, saleData);
    return response;
  }
);

// Sale slice
const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        state.sales.push(action.payload);
      })
      .addCase(saveSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save sale';
      })
      .addCase(updateSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        const updatedSale = action.payload;
        const index = state.sales.findIndex((s) => s.id === updatedSale.id);
        if (index !== -1) {
          state.sales[index] = updatedSale;
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update sale';
      });
  },
});

export default saleSlice.reducer;
