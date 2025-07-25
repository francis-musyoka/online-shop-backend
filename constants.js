
const DEVELOPMENT_FRONT_END_URL = process.env.DEVELOPMENT_FRONT_END_URL;
const PRODUCTION_FRONT_END_URL = process.env.PRODUCTION_FRONT_END_URL;

const DEVELOPMENT_BACK_END_URL = process.env.DEVELOPMENT_BACK_END_URL;
export const PRODUCTION_BACK_END_URL = process.env.PRODUCTION_BACK_END_URL;


export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const ALLOWED_ORIGINS = [DEVELOPMENT_FRONT_END_URL, PRODUCTION_FRONT_END_URL];
export const DOMAIN = IS_PRODUCTION ? PRODUCTION_FRONT_END_URL : DEVELOPMENT_FRONT_END_URL;
export const LINK = IS_PRODUCTION ? PRODUCTION_FRONT_END_URL : DEVELOPMENT_FRONT_END_URL;