class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["sort", "fields", "q", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Advance filter using: lt, lte, gt, gte
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    // limiting fields
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // Pagination and Limit
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    // Page 1: 1 - 10; Page 2: 11 - 20; Page 3: 21- 30

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if(this.queryStr.page){
    //   const moviesCount = await Movie.countDocuments();
    //   if(skip >= moviesCount){
    //     throw new Error('This page is not found!!')
    //   }
    // }

    return this;
  }
}

module.exports = ApiFeatures;
