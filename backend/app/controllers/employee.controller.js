const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const EmployeeService = require("../services/employee.service")

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const employees = await employeeService.findByName(req.body?.name);
        if(employees.length > 0){
            return next(new ApiError(409, "Employee existed"));
        }
        const document = await employeeService.create(req.body);
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the employee")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const { name } = req.query;
        if(name) {
            documents = await employeeService.findByName(name);
        }
        else {
            documents = await employeeService.find({});
        };
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving employees"));
    };

    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Employee not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving employee with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty!"));
    };
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const employees = await employeeService.findByName(req.body.name);
        if(employees.length > 1) {
            return next(new ApiError(409, "Conflict employee name"));
        }
        const document = await employeeService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Employee not found!"));
        }
        return res.send({ message: "Employee was updated successfully" });
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Error updating contact with id=${req.params.id}`
            )
        ); 
    }
};

exports.delete = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Employee not found!"));
        }
        return res.send({ message: "Employee was deleted successfully" });
    }
    catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete employee with id=${req.params.id}`
            )
        );
    };
};

exports.login = async (req, res, next) => {
    try {
        if(!req.body) {
            return next(new ApiError(400, "Data can not be empty"));
        }

        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.login(req.body);
        if(document) {
            req.session.user = {
                id: document._id,
                username: document.name,
                role: document.role
            };

            return res.send({ message: "Login successful", user: req.session.user })
            // return res.send({ message: "Login successful" })
        } else if (document === false) {
            return next(new ApiError(401, "Username or password is wrong"));
        } else {
            return next(new ApiError(404, "Employee is not found")); 
        }
    } catch (error) {
         return next(new ApiError(500, "An error occurred during login"));
    }
}

exports.logout = async (req, res, next) => {
    try {
        if(req.session.user) {
            console.log(req.session.user);
            req.session.destroy((err) => {
                if(err) {
                    return next(new ApiError(500, "An error occurred during logout"));
                }
                res.clearCookie("session-id");
                return res.send({ message: "Logout successful" })
            });
        }
        else {
            return next(new ApiError(400, "No user is logged in"));
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred during logout"));
    }
}