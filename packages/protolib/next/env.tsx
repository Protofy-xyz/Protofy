let devMode = false;

if (process && process.env.NODE_ENV === 'development') {
    devMode = true;
}

export {devMode};