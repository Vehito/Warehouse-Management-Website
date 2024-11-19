const express = require("express");
const cors = require("cors");
const routers = require("./app/routes/index.route")
const ApiError = require("./app/api-error");

const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
    name: "session-id",
    secret: "GFGEnter",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: "./sessions",
        reapInterval: 3600,  // Thời gian xóa session cũ, tính bằng giây
        ttl: 3600           // Thời gian tồn tại của session file, tính bằng giây
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

// Xác nhận đăng nhập
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next(); // Đã đăng nhập, tiếp tục xử lý
    } else {
        res.status(401).json({ message: "Unauthorized access. Please log in first." });
    }
}

app.use("/api/products", authMiddleware, routers.product);
app.use("/api/importShipments", authMiddleware, routers.importShipment);
app.use("/api/customers", authMiddleware, routers.customer);
app.use("/api/employees", authMiddleware, routers.employee);
app.use("/api/auth", routers.auth);

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

//handler 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found!!!"));
});

app.use((err, req, res, next) => {
    //Middleware xu ly loi tap trung
    //Trong cac doan code xu ly o cac route, goi next(error) se chuyen ve middleware xu ly loi nay
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;