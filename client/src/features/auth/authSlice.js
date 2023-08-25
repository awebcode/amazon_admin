import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import authService from "./authServices";

// const getUserfromLocalStorage = localStorage.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;
const initialState = {
  user: null,
  orders: [],
  isError: false,
  isLoading: false,
  isLoginLoading: false,
  isSuccess: false,
  message: "",
  isLogoutSuccess: false,
  isLoginSuccess: false,
  isGetMeSuccess: false,
};
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const getMyDetails = createAsyncThunk("auth/myDetails", async (thunkAPI) => {
  try {
    return await authService.getMyDetails();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getOrders = createAsyncThunk(
  "order/get-orders",
  async (thunkAPI) => {
    try {
      return await authService.getOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getMyOrders = createAsyncThunk("order/get-my-orders", async (thunkAPI) => {
  try {
    return await authService.getMyOrders();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const getOrderByUser = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      return await authService.getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetUserState = createAction("Reset_all");
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (buildeer) => {
    buildeer
      .addCase(login.pending, (state) => {
        state.isLoginLoading = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoginLoading = false;
        state.isLoginSuccess = true;
        state.user = action.payload;
        state.message = "success";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isLogoutSuccess = true;
        state.user = "";
        state.message = "";
      })
      .addCase(getMyDetails.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isGetMeSuccess = true;
        state.user = action.payload.user;
        state.message = "success";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isLoginSuccess = false;
        state.message = action.error;
        state.isLoginLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isError = true;
        state.isLogoutSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getMyDetails.rejected, (state, action) => {
        state.isError = true;
        state.isGetMeSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = "success";
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = "success";
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orderbyuser = action.payload;
        state.message = "success";
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(resetUserState, () => initialState);
  },
});

export default authSlice.reducer;
