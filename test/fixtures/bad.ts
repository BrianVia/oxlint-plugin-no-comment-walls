// Expired guides are locked — the backend 409s any PUT. This is the frontend
// chokepoint for single-guide writes (updateGuideOrders owns the batch case),
// so every surface is covered without per-caller guards; surfaces only hide
// or disable their affordances.
export const bad = 1;
