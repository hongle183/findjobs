const Company = require('../models/Company');
const Job = require('../models/Job');

class CompanyController {
    // [GET] /company
    index(req, res, next) {
        Company.find({ status: true }, 'name category logo place')
            .sort({ name: 1 })
            .then((companies) => {
                res.render('companies', {
                    title: 'Các nhà tuyển dụng',
                    companies: companies.map((company) => {
                        return {
                            _id: company._id,
                            name: company.name,
                            category: company.category,
                            logo: company.logo,
                            place: company.getPlace(company.place),
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }
    // [POST] /companies/search
    search(req, res, next) {
        const searchComp = req.body.searchTerm;
        Company.find({
            $or: [{ name: { $regex: searchComp, $options: 'i' } }, { category: { $regex: searchComp, $options: 'i' } }],
        })
            .select('_id name category logo place')
            .then((companies) => {
                res.render('companies', {
                    title: 'Các nhà tuyển dụng',
                    companies: companies.map((company) => {
                        return {
                            _id: company._id,
                            name: company.name,
                            category: company.category,
                            logo: company.logo,
                            place: company.getPlace(company.place),
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }

    // [GET] /companies/sort/:sortby
    sort(req, res, next) {
        var sortby = 1;
        if (req.params.sortby === 'sortza') sortby = -1;
        Company.find({ status: true }, 'name category logo place')
            .sort({ name: sortby })
            .then((companies) => {
                res.render('companies', {
                    title: 'Các nhà tuyển dụng',
                    companies: companies.map((company) => {
                        return {
                            _id: company._id,
                            name: company.name,
                            category: company.category,
                            logo: company.logo,
                            place: company.getPlace(company.place),
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }

    // [GET] /companies/companies_details
    company_detail(req, res, next) {
        Company.findOne({ _id: req.params.id, status: true }, 'name category logo place website desc createAt')
            .then((company) => {
                Job.find({ company: company._id, status: true }, 'id name place salary deadline').then((jobs) => {
                    res.render('company_detail', {
                        title: 'Chi tiết công ty',
                        company: {
                            _id: company._id,
                            name: company.name,
                            category: company.category,
                            logo: company.logo,
                            place: company.place,
                            website: company.website,
                            desc: company.desc,
                            createAt: company.getPostDay(company.createAt),
                        },
                        jobs: jobs.map((job) => {
                            return {
                                _id: job._id,
                                company: { name: company.name, img: company.logo },
                                name: job.name,
                                place: job.getPlace(job.place),
                                salary: job.salary,
                                deadline: job.deadline,
                            };
                        }),
                    });
                });
            })
            .catch((error) => next(error));
    }
}

module.exports = new CompanyController();
