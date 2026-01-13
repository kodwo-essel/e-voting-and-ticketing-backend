export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PaginationHelper {
  static getParams(query: PaginationQuery) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
  }

  static formatResponse<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}