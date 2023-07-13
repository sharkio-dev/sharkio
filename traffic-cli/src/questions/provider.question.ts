import inquirer from 'inquirer';

import { Answer, ProviderValue, Choice } from '../models/choice.ts';

export async function providerQuestion(): Promise<Answer> {

    const listOfCommands: Choice[] = [
        {name: 'listRequests', value: ProviderValue.listRequests},
        {name: 'addRequest', value: ProviderValue.addRequest},
        {name: 'removeRequest', value: ProviderValue.removeRequest},
        {name: 'execute', value: ProviderValue.execute},
    ];

    return await inquirer.prompt([{
        name: 'provider',
        type: 'list',
        message: 'Select a command:',
        choices: listOfCommands,
    }]);
}