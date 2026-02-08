export const createPaginationObject = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      total,
      limit,
      offset: (page - 1) * limit,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
