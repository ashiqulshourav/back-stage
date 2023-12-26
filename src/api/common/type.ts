declare namespace COMMON {
  type ListData<T = Record<string, any>> = {
    total: number;
    list: T[];
    pageNum?: number;
    pageSize?: number;
    size?: number;
    startRow?: number;
    endRow?: number;
    pages?: number;
    prePage?: number;
    nextPage?: number;
    isFirstPage?: boolean;
    isLastPage?: boolean;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    navigatePages?: number;
    navigatepageNums?: number[];
    navigateFirstPage?: number;
    navigateLastPage?: number;
  };

  type ListRes<T = ListData> = {
    code: number;
    msg: string;
    data: T;
  }

  type ListFetchProps = {
    pageSize: number;
    pageNum: number;
  }

  type FormProps<T = any> = {
    formInline: T;
  }
}