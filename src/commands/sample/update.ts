const inquirer = require('inquirer');
import { category } from '../../constants';

const subcommand = 'update';

module.exports = {
  name: subcommand,
  run: async (context) => {
    const { amplify } = context;
    const amplifyMeta = amplify.getProjectMeta();

    if (!(category in amplifyMeta) || Object.keys(amplifyMeta[category]).length === 0) {
      context.print.error(`You have no ${category} projects.`);
      return;
    }

    const chooseProject = [
      {
        type: 'list',
        name: 'resourceName',
        message: 'Choose what project you want to update?',
        choices: Object.keys(amplifyMeta[category]),
        default: Object.keys(amplifyMeta[category])[0],
      },
    ];

    const props = await inquirer.prompt(chooseProject);

    const options = amplifyMeta[category][props.resourceName];

    const providerController = require(`../../provider-utils/${options.providerPlugin}/index`);
    if (!providerController) {
      context.print.error('Provider not configured for this category');
      return;
    }

    /* eslint-disable */
    return providerController.updateResource(context, options.serviceType, options, props.resourceName);
    /* eslint-enable */
  },

};