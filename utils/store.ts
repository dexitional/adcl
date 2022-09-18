import axios from "axios";
import create from "zustand";
import { persist } from "zustand/middleware";

interface Props {
  user: any;
  cart: any;
  held: any;
  siteid: any;
  site: any;
  eid: any;
  helper: any;
  fetchHelpers: any;
  sale: any;
  showSidebar: boolean;
  receipt: any;
}

export const useUserStore = create(
  persist<Props>(
    (set) => ({
      user: null,
      cart: [],
      held: [],
      siteid: null,
      site: null,
      eid: null,
      helper: null,
      sale: null,
      receipt: null,
      showSidebar: false,
      fetchHelpers: async () => {
        const res = await axios.get('/api/helpers');
        if(res.data.success){
          set({ helper: res.data.data })
        }
      },
    }),
    {
      name: "posStore", // name of item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);
