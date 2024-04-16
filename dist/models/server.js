"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alumno_1 = __importDefault(require("../routes/alumno"));
const cita_1 = __importDefault(require("../routes/cita"));
const connection_1 = __importDefault(require("../db/connection"));
const cors_1 = __importDefault(require("cors"));
const alumno_2 = require("./alumno");
const cita_2 = require("./cita");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Server running on port ${this.port}`);
        });
    }
    routes() {
        this.app.use('/api/alumnos', alumno_1.default);
        this.app.use('/api/citas', cita_1.default);
    }
    midlewares() {
        this.app.use(express_1.default.json());
        // Cors
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                yield alumno_2.Alumno.sync();
                yield cita_2.Cita.sync();
                console.log('[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Successful Database Connection');
            }
            catch (error) {
                console.log('[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Failed Database Connection');
                //console.log(error);
            }
        });
    }
}
exports.default = Server;
