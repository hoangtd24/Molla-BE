"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv").config();
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Hello_1 = require("./resolvers/Hello");
const cors_1 = __importDefault(require("cors"));
const Product_1 = require("./entities/Product");
const User_2 = require("./resolvers/User");
const Category_1 = require("./entities/Category");
const Discount_1 = require("./entities/Discount");
const Discount_2 = require("./resolvers/Discount");
const Category_2 = require("./resolvers/Category");
const Product_2 = require("./resolvers/Product");
const Review_1 = require("./entities/Review");
const Review_2 = require("./resolvers/Review");
const Cart_1 = require("./entities/Cart");
const Cart_2 = require("./resolvers/Cart");
const refreshToken_1 = __importDefault(require("./routes/refreshToken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Order_1 = require("./entities/Order");
const Payment_1 = require("./entities/Payment");
const Payment_2 = require("./resolvers/Payment");
const Order_2 = require("./resolvers/Order");
const mongoose_1 = __importDefault(require("mongoose"));
const Wishlist_1 = require("./entities/Wishlist");
const Wishlist_2 = require("./resolvers/Wishlist");
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
exports.AppDataSource = new typeorm_1.DataSource(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: "postgres" }, (constants_1.__prod__
    ? { url: process.env.POSTGRES_URL }
    : {
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    })), { logging: true }), (constants_1.__prod__
    ? {
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        ssl: true,
    }
    : {})), (constants_1.__prod__ ? {} : { synchronize: true })), { entities: [
        User_1.User,
        Product_1.Product,
        Category_1.Category,
        Discount_1.Discount,
        Review_1.Review,
        Cart_1.Cart,
        Order_1.Order,
        Payment_1.Payment,
        Wishlist_1.Wishlist,
    ], migrations: [path_1.default.join(__dirname, "./migrations/*")] }));
const main = async () => {
    await exports.AppDataSource.initialize()
        .then(() => {
        console.log("Data Source has been initialized!");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
    if (constants_1.__prod__) {
        await exports.AppDataSource.runMigrations();
    }
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: constants_1.__prod__
            ? process.env.CORS_ORIGIN_PROD
            : process.env.CORS_ORIGIN_DEV,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use("/refresh_token", refreshToken_1.default);
    const httpServer = http_1.default.createServer(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [
                Hello_1.GreetingResovler,
                User_2.UserResolver,
                Discount_2.DiscountResolver,
                Category_2.CategoryResolver,
                Product_2.ProductResolver,
                Review_2.ReviewResolver,
                Cart_2.CartResolver,
                Payment_2.PaymentResolver,
                Order_2.OrderResolver,
                Wishlist_2.WishlistResolver,
            ],
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
        context: ({ req, res }) => ({ req, res }),
    });
    await apolloServer.start();
    await mongoose_1.default.connect(`mongodb+srv://hoangtd241100:${process.env.MONGOOSE_PASS}@cluster0.4ozdp8b.mongodb.net/`);
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: constants_1.__prod__
                ? process.env.CORS_ORIGIN_PROD
                : process.env.CORS_ORIGIN_DEV,
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        },
    });
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`);
};
main();
//# sourceMappingURL=index.js.map