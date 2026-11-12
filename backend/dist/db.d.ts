import mysql from 'mysql2/promise';
export declare function closePool(): Promise<void>;
export declare function query<T = any>(sql: string, params?: any[]): Promise<T[]>;
export declare function exec(sql: string, params?: any[]): Promise<mysql.ResultSetHeader>;
//# sourceMappingURL=db.d.ts.map