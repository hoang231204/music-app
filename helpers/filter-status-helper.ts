export interface StatusItem {
  name: string;
  status: string;
  class: string;
}
export interface QueryParams {
  status?: string;
  [key: string]: unknown;
}

export type FilterType = 'topic' | 'song' | 'role' | 'user' | 'account' | (string & {});
const filterStatusHelper = (query: QueryParams, type: FilterType): StatusItem[] => {
  const allStatuses: StatusItem[] = [
    { name: "Tất cả", status: "", class: "" },
    { name: "Hoạt động", status: "active", class: "" },
    { name: "Dừng hoạt động", status: "inactive", class: "" }
  ];

  const topicStatuses: string[] = ["", "active", "inactive"];
  const songStatuses: string[] = ["", "active", "inactive"];
  const roleStatuses: string[] = ["", "active", "inactive"];
  const userStatuses: string[] = ["", "active", "inactive"];
  const accountStatuses: string[] = ["", "active", "inactive"];

  let filterStatus: StatusItem[] = [];

  if (type === 'topic') {
    filterStatus = allStatuses.filter(item => topicStatuses.includes(item.status));
  }
  if (type === 'song') {
    filterStatus = allStatuses.filter(item => songStatuses.includes(item.status));
  }
  if (type === 'role') {
    filterStatus = allStatuses.filter(item => roleStatuses.includes(item.status));
  }
  if (type === 'user') {
    filterStatus = allStatuses.filter(item => userStatuses.includes(item.status));
  }
  if (type === 'account') {
    filterStatus = allStatuses.filter(item => accountStatuses.includes(item.status));
  }

  filterStatus = filterStatus.map(item => ({ ...item }));
  if (query && query.status) {
    const index = filterStatus.findIndex(item => item.status === query.status);
    if (index !== -1) {
      filterStatus[index].class = "active";
    } else {
      const defaultIndex = filterStatus.findIndex(item => item.status === "");
      if (defaultIndex !== -1) filterStatus[defaultIndex].class = "active";
    }
  } else {
    const index = filterStatus.findIndex(item => item.status === "");
    if (index !== -1) {
      filterStatus[index].class = "active";
    }
  }

  return filterStatus;
};

export default filterStatusHelper;
