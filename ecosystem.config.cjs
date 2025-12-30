// eslint-disable-next-line no-undef
module.exports = {
    apps: [
        {
            name: 'backend',
            script: 'php',
            args: 'artisan serve',
        },
        {
            name: 'frontend',
            script: 'npm',
            args: 'run dev',
        },
        {
            name: 'reverb',
            script: 'php',
            args: 'artisan reverb:start',
        },
        {
            name: 'queue',
            script: 'php',
            args: 'artisan queue:work',
        },
    ],
};
