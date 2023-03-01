import { hookstate } from "@hookstate/core";
import meetingApi from "../../../services/apis/meeting";

const initialState = {
  isLoading: false,
  items: [],
  pageSize: 10,
  pageIndex: 1,
  total: 0,
};

const store = hookstate(initialState);

export const getAllMeeting = async (params) => {
try {
    store.isLoading.set(true);
    const _params = {
      ...params,
      page_index: params?.pageIndex ? params.pageIndex : store.pageIndex.get(),
      page_size: params?.pageSize ? params.pageSize : store.pageSize.get(),
    };
    const res = await meetingApi.getAll(_params);

    const { items } = res.data.result;

    for(let i = 0; i < items.length; i++) {
        const _res = await meetingApi.getOne(items[i]._id);
        const arr = _res.data.result.list_user;
        items[i].list_user = arr.map(item => item.name).join(", ");
    }

    store.set({
      items: items,
      pageIndex: res.data.result.page_index,
      pageSize: res.data.result.page_size,
      total: res.data.result.total,
      isLoading: false,
    });
  } catch (error) {
    store.isLoading.set(false);
  }
}

export default store;
