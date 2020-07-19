const Proverb = require("./../schemas/proverbs");

const FILTERING_EXCLUSIONS = ["limit", "offset", "sort", "order", "fields"];

class Query {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.page = this.queryString.page * 1 || 1;
        this.limit = this.queryString.limit * 1 || 100;
    }

    filter() {

        // Filtering

        if(Object.keys(this.queryString).length !== 0) {
            console.log(this.queryString);
            let filters = {...this.queryString};
            console.log(filters);
    
            FILTERING_EXCLUSIONS.forEach(el => delete filters[el]);
            console.log(filters);
    
            this.query = this.query.find(filters); 
            
        }
        return this;
    }

    sort() {

        // Sorting
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(",", " ");
            this.query = query.sort(sortBy);
        } 

        return this;           
        
    }

    project() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            console.log(fields);
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }

        return this;       
    }

    async paginate() {
        const skip = (this.page - 1) * this.limit;

        if(this.page > 1) {
            const numberOfProverbs = await Proverb.countDocuments();
        if (skip >= numberOfProverbs) throw new Error("Page out of range.");
        }
        
        this.query = this.query.skip(skip).limit(this.limit);

        return this;
    }
           
}

module.exports = Query;