import { hookstate } from "@hookstate/core";


const initialState = {
  isLogged: false,
  user: null
};

const store = hookstate(initialState);

export default store;
