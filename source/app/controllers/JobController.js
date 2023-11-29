const Job = require('../models/Job');

class JobController {
    // [GET] /job
    index(req, res, next) {
        Job.find({ status: true }, 'name company place salary deadline')
            .sort({ name: 1 })
            .populate({
                path: 'company',
                select: 'name logo',
            })
            .then((jobs) => {
                res.render('jobs', {
                    title: 'Tin tuyển dụng, việc làm tốt nhất',
                    jobs: jobs.map((job) => {
                        return {
                            _id: job._id,
                            name: job.name,
                            company: job.company
                                ? {
                                      name: job.company.name,
                                      img: job.company.logo,
                                  }
                                : '',
                            place: job.getPlace(job.place),
                            salary: job.salary,
                            deadline: job.deadline,
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }
    // [POST] /jobs/search
    search(req, res, next) {
        const searchTerm = req.body.searchTerm;
        Job.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ],
        })
            .populate('company', 'name logo')
            .select('_id name company place salary deadline')
            .then((jobs) => {
                res.render('jobs', {
                    title: 'Tin tuyển dụng, việc làm tốt nhất',
                    jobs: jobs.map((job) => {
                        return {
                            _id: job._id,
                            name: job.name,
                            company: job.company
                                ? {
                                      name: job.company.name,
                                      img: job.company.logo,
                                  }
                                : '',
                            place: job.getPlace(job.place),
                            salary: job.salary,
                            deadline: job.deadline,
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }
    // [POST] /job/sort
    sort(req, res, next) {
        var sortby = 1;
        if (req.params.sortby === 'sortza') sortby = -1;
        Job.find({ status: true }, 'name company place salary deadline')
            .sort({ name: sortby })
            .populate({
                path: 'company',
                select: 'name logo',
            })
            .then((jobs) => {
                res.render('jobs', {
                    title: 'Tin tuyển dụng, việc làm tốt nhất',
                    jobs: jobs.map((job) => {
                        return {
                            _id: job._id,
                            name: job.name,
                            company: job.company
                                ? {
                                      name: job.company.name,
                                      img: job.company.logo,
                                  }
                                : '',
                            place: job.getPlace(job.place),
                            salary: job.salary,
                            deadline: job.deadline,
                        };
                    }),
                });
            })
            .catch((error) => next(error));
    }
    // [GET] /job/:id
    job_details(req, res, next) {
        Job.findOne(
            { _id: req.params.id, status: true },
            'name company place salary slot deadline desc require benefit job_type position createAt',
        )
            .populate({
                path: 'company',
                select: 'name logo place website desc',
            })
            .then((job) => {
                res.render('job_details', {
                    title: 'Chi tiết việc làm',
                    job: {
                        _id: job._id,
                        name: job.name,
                        company: job.company
                            ? {
                                  name: job.company.name,
                                  img: job.company.logo,
                                  place: job.company.place,
                                  website: job.company.website,
                                  desc: job.company.desc[0],
                              }
                            : '',
                        place: job.getPlaceDetail(job.place),
                        salary: job.salary,
                        slot: job.slot,
                        deadline: job.deadline,
                        desc: job.desc,
                        require: job.require,
                        benefit: job.benefit,
                        job_type: job.job_type,
                        position: job.position,
                        createAt: job.getPostDay(job.createAt),
                    },
                });
            })
            .catch((error) => next(error));
    }
}

module.exports = new JobController();
