class ApiFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    console.log("entered search: ",this.querystr);
    
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
          
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  pagination(resultPerPage) {
    console.log("entered pagination: ",this.querystr.page);
    const currentPage = Number(this.querystr.page) || 1; //50-10 //page skip logic

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
  filter() {
    const queryCopy = { ...this.querystr }; //remove some field for category

    const removeField = ["keyword", "page", "limit"];

    removeField.forEach((key) => delete queryCopy[key]); //price filter as price cannot be fixed price has a range //now we know mongodb operator has doller in prefix so we have to change gte lte gt lt into $lte....

    let querystr = JSON.stringify(queryCopy);

    querystr = querystr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querystr));

    return this;
  }
  
}
module.exports = ApiFeatures;
