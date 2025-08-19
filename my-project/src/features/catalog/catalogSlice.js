import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { getMetaBusinessId } from "../../utils/custom";


// POST /api/catalog/:metaBusinessId

// accessToken in query

// name in body


export const createCatalog = createAsyncThunk(
    "catalog/createCatalog",
    async (payload, { rejectWithValue }) => {
        const { metaId, formData } = payload;
        const name = formData?.name;
        const accessToken = formData?.accessToken;
        try {
            const url = `/catalog/${metaId}?accessToken=${encodeURIComponent(accessToken)}`;
            const res = await api.post(url, { name });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error creating catalog");
        }
    }
);




export const deleteCatalog = createAsyncThunk(
    "catalog/deleteCatalog",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/catalog/${id}`);
            return id; // return the deleted ID so we can update state
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting catalog");
        }
    }
);

export const getCatalog = createAsyncThunk(
    "catalog/getCatalog",
    async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
        const id = getMetaBusinessId();
        try {
            const res = await api.get(`/catalog/${id}?page=${page}&pageSize=${pageSize}`);
            console.log("reso", res.data.data);

            return {
                catalogs: res.data.data || [],
                pagination: res.data.pagination || {}
            };
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error fetching catalog");
        }
    }
);

const catalogSlice = createSlice({
    name: "catalog",
    initialState: {
        catalogs: [],
        pagination: {
            totalRecords: 0,
            currentPage: 1,
            totalPages: 1,
            pageSize: 10
        },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createCatalog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCatalog.fulfilled, (state, action) => {
                state.loading = false;
                state.catalogs.push(action.payload);
            })
            .addCase(createCatalog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET

            .addCase(getCatalog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCatalog.fulfilled, (state, action) => {
                state.loading = false;
                state.catalogs = action.payload.catalogs;
                state.pagination = action.payload.pagination;
            })
            .addCase(getCatalog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteCatalog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCatalog.fulfilled, (state, action) => {
                state.loading = false;
                state.catalogs = state.catalogs.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteCatalog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default catalogSlice.reducer;
