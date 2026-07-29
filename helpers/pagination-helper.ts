interface paginationQuery{
    page?: number | string;
    limit?: number | string;
}
interface paginationResult {
    currentPage: number;
    totalPages: number;
    limitPage: number;
    skipPage: number;
}
const paginationHelper = (query: paginationQuery, countData: number): paginationResult => {
    let objectPagination: paginationResult = {
        currentPage:1,
        limitPage:4,
        skipPage:0,
        totalPages:0,
    }
    if(query.page){
        objectPagination.currentPage = Number(query.page);
    }
    if(query.limit){
        objectPagination.limitPage = Number(query.limit);
    }
    objectPagination.skipPage = (objectPagination.currentPage - 1)*objectPagination.limitPage;
    objectPagination.totalPages = Math.ceil(countData/objectPagination.limitPage);
    return objectPagination;
}
export default paginationHelper;