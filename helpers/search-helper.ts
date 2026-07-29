const createSearchRegex = (query: { keyword: string }) => {
    let item = query.keyword;
    const regex = new RegExp(item, 'i');
    return regex;
};
export default createSearchRegex;