import express, { Application, Request, Response } from 'express';
import routesAlumno from '../routes/alumno/alumno';
import routesCitas from '../routes/cita/cita';
import routesConfirmacion from '../routes/cita/citaconfirmacion';
import routesTipo from '../routes/cita/citatipo';
import routesModalidad from '../routes/cita/citamodalidad';
import routesEap from '../routes/alumno/eap';
import routesEstado from '../routes/alumno/estado';
import routesAuth from '../routes/auth/auth';
import db from '../db/connection';
import cors from 'cors';
import { Alumno } from './alumno';
import { Cita } from './cita';

class Server {
    private app: Application;
    private port: string;



    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Server running on port ${this.port}`);
        })
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'Citas Service Running'
            })
        });
        this.app.use('/api/alumnos', routesAlumno);
        this.app.use('/api/eap', routesEap);
        this.app.use('/api/estado', routesEstado);
        this.app.use('/api/citas', routesCitas);
        this.app.use('/api/citaconfirmacion', routesConfirmacion);
        this.app.use('/api/citamodalidad', routesModalidad);
        this.app.use('/api/citatipo', routesTipo);
        this.app.use('/auth', routesAuth);
    }


    midlewares() {
        this.app.use(express.json());
        // Configuración de CORS
        const whitelist = ['http://localhost:4200', 'https://raphaelwmr.github.io']; // Definir los orígenes permitidos
        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };

        this.app.use(cors(corsOptions));
    }

    async dbConnect() {
        try {
            await db.authenticate();
            await Alumno.sync();
            await Cita.sync();
            console.log('[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Successful Database Connection');
        } catch (error) {
            console.log('[FisiBienestar] >>>>>>>>>>>>>>>>>>>> Failed Database Connection');
            console.log(error);
        }
    }
}
export default Server; 