class APIFeatures {
  // mongoose query , express query string
  // passing query and not using it directly as that would bind this class to Tour resource only
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // filter on fields
    let reqTempObject = { ...this.queryString };
    const excludedFields = ['sort', 'filter', 'page', 'limit'];
    excludedFields.forEach((field) => delete reqTempObject[field]);

    //filter on  operators

    reqTempObject = JSON.parse(
      JSON.stringify(reqTempObject).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );

    // build query
    // reqTempObject ( - sort,filter,page,limit +operators,filtering fields)
    this.query = this.query.find(reqTempObject);

    return this;
  }

  sort() {
    const sort = this.queryString.sort.split(',').join(' ');
    this.query = this.query.sort(sort);
    return this;
  }
  fields() {
    const allFields = this.queryString.fields.split(',').join(' ');
    this.query = this.query.select(allFields);
    return this;
  }
  page() {
    const limit = +this.queryString.limit || 5;
    const page = +this.queryString.page || 1;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    if (this.queryString.page) {
      // independent of query
      const totalDocuments = (async () => {
        await this.query.countDocuments();
      })();
      if (totalDocuments <= skip) {
        throw new Error('Page does not exist');
      }
    }
    return this;
  }
}
module.exports = APIFeatures;
