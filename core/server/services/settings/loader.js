const fs = require('fs-extra'),
    path = require('path'),
    debug = require('ghost-ignition').debug('services:settings:settings-loader'),
    common = require('../../lib/common'),
    config = require('../../config'),
    yamlParser = require('./yaml-parser');

/**
 * Reads the desired settings YAML file and passes the
 * file to the YAML parser which then returns a JSON object.
 * @param {String} setting the requested settings as defined in setting knownSettings
 * @returns {Object} settingsFile
 */
module.exports = function loadSettings(setting) {
    // we only support the `yaml` file extension. `yml` will be ignored.
    const fileName = `${setting}.yaml`;
    const contentPath = config.getContentPath('settings');
    const filePath = path.join(contentPath, fileName);

    try {
        const file = fs.readFileSync(filePath, 'utf8');
        debug('settings file found for', setting);

        // yamlParser returns a JSON object
        return yamlParser(file, fileName);
    } catch (err) {
        if (common.errors.utils.isIgnitionError(err)) {
            throw err;
        }

        throw new common.errors.GhostError({
            message: common.i18n.t('errors.services.settings.loader', {setting: setting, path: contentPath}),
            context: filePath,
            err: err
        });
    }
};
