import dotenv from 'dotenv';

export default {

    HOST:process.env.PGHOST,
    USER:process.env.PGUSER,
    PASSWORD:process.env.PGPASSWORD,
    DB:process.env.PGDATABASE,

    // HOST:"localhost",
    // USER:"postgres",
    // PASSWORD:"postgres",
    // DB:"postgres",
    dialect:"postgres",
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }

}