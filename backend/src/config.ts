export default {
    APP: {
        PORT: process.env.APP_PORT || '',
    },

    DATABASE: {
        HOST: process.env.DATABASE_HOST || '',
        PORT: process.env.DATABASE_PORT || '',
        USERNAME: process.env.DATABASE_USERNAME || '',
        PASSWORD: process.env.DATABASE_PASSWORD || '',
        NAME: process.env.DATABASE_NAME || '',
    }
};
