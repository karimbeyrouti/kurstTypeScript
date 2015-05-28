declare module "mysql"
{
    export function createConnection(connectionOptions : ConnectionOptions ): Connection;

    export class Connection
    {
        constructor();
        public connect( callback ? : (...args: any[]) => void );
        public query( qury : string , callback ? : ( error  : any , results: any  , fields : any ) => void );
        public query( qury : string , values : any , callback ? : ( error  : any , results: any  , fields : any ) => void );
    }

    export interface ConnectionOptions
    {

        host ? : string;
        port ? : string;
        localAddress ? : string;
        socketPath ? : string;
        user ? : string;
        password ? : string;
        database ? : string;
        connectTimeout ? : number;

    }

}
/*
this.host               = options.host || 'localhost';
this.port               = options.port || 3306;
this.localAddress       = options.localAddress;
this.socketPath         = options.socketPath;
this.user               = options.user || undefined;
this.password           = options.password || undefined;
this.database           = options.database;
this.connectTimeout     = (options.connectTimeout === undefined)
    ? (2 * 60 * 1000)
    : options.connectTimeout;
this.insecureAuth       = options.insecureAuth || false;
this.supportBigNumbers  = options.supportBigNumbers || false;
this.bigNumberStrings   = options.bigNumberStrings || false;
this.dateStrings        = options.dateStrings || false;
this.debug              = options.debug;
this.trace              = options.trace !== false;
this.stringifyObjects   = options.stringifyObjects || false;
this.timezone           = options.timezone || 'local';
this.flags              = options.flags || '';
this.queryFormat        = options.queryFormat;
this.pool               = options.pool || undefined;
this.ssl                = (typeof options.ssl === 'string')
    ? ConnectionConfig.getSSLProfile(options.ssl)
    : (options.ssl || false);
this.multipleStatements = options.multipleStatements || false;
this.typeCast           = (options.typeCast === undefined)
*/