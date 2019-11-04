module.exports = function(api) {
    api.cache(true);

    const config = {
        "presets": [
            "@babel/preset-env"
        ],
        "plugins": [
            ["@babel/plugin-proposal-decorators", {"legacy": true}],
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-proposal-do-expressions",
        ]
    };

    return config;
}
