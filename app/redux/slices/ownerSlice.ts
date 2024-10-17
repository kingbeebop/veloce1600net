import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Owner } from '../../types/owner';
import { saveOwnerAPI, updateOwner as updateOwnerAPI} from '../../utils/api';

interface OwnerState {
  owners: Owner[];
  loading: boolean;
  error: string | null;
}

const initialState: OwnerState = {
  owners: [],
  loading: false,
  error: null,
};

// Thunks for owners
export const saveOwner = createAsyncThunk<Owner, Owner>(
  'owners/saveOwner',
  async (ownerData) => {
    const response = await saveOwnerAPI(ownerData);
    return response;
  }
);

export const updateOwner = createAsyncThunk<Owner, { id: number, ownerData: Partial<Owner> }>(
  'owners/updateOwner',
  async ({ id, ownerData }) => {
    const response = await updateOwnerAPI(id, ownerData);
    return response;
  }
);

// Owner slice
const ownerSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOwner.fulfilled, (state, action: PayloadAction<Owner>) => {
        state.loading = false;
        state.owners.push(action.payload);
      })
      .addCase(saveOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save owner';
      })
      .addCase(updateOwner.fulfilled, (state, action: PayloadAction<Owner>) => {
        const updatedOwner = action.payload;
        const index = state.owners.findIndex((o) => o.id === updatedOwner.id);
        if (index !== -1) {
          state.owners[index] = updatedOwner;
        }
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update owner';
      });
  },
});

export default ownerSlice.reducer;
