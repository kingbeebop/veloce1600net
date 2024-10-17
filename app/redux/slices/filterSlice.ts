// filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Ensure you're importing RootState correctly

interface PriceFilter {
    operator: 'greater' | 'less';
    value: number;
}

interface FilterState {
    searchTerm: string;
    priceFilter: PriceFilter | null;
    conditionFilter: 'New' | 'Used' | 'Classic' | null;
}

const initialState: FilterState = {
    searchTerm: '',
    priceFilter: null,
    conditionFilter: null,
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        setPriceFilter(state, action: PayloadAction<PriceFilter | null>) {
            state.priceFilter = action.payload ?? null;
        },
        setConditionFilter(state, action: PayloadAction<'New' | 'Used' | 'Classic' | null>) {
            state.conditionFilter = action.payload ?? null;
        },
        clearFilters(state) {
            state.searchTerm = '';
            state.priceFilter = null;
            state.conditionFilter = null;
        },
        resetFilters() {
            // Reset the state to the initial values
            return initialState;
        },
        updateFilters(state, action: PayloadAction<Partial<FilterState>>) {
            // Update only the provided fields in the filter
            const { searchTerm, priceFilter, conditionFilter } = action.payload;
            if (searchTerm !== undefined) {
                state.searchTerm = searchTerm;
            }
            if (priceFilter !== undefined) {
                state.priceFilter = priceFilter;
            }
            if (conditionFilter !== undefined) {
                state.conditionFilter = conditionFilter;
            }
        },
    },
});

// Export actions and reducer
export const { setSearchTerm, setPriceFilter, setConditionFilter, clearFilters, resetFilters, updateFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

// Selector to access filters from the state
export const selectFilters = (state: RootState) => state.filters;
