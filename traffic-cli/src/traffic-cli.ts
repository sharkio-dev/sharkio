import { Answer, ProviderValue } from './models/choice.ts';
//import { listActions } from './actions'; 
import { providerQuestion } from './questions/provider.question.ts';
import { showTitleAndBanner } from './utils/logger.util.ts';

export async function CGX(): Promise<any> {
    showTitleAndBanner();

    const providerAnswer: Answer = await providerQuestion();

/*     if (providerAnswer.provider === ProviderValue.listRequests) {
        return await listActions();
    } else if (providerAnswer.provider === ProviderValue.addRequest)  {
        return await addRequestActions();
    } else if (providerAnswer.provider === ProviderValue.removeRequest)  {
        return await removeRequestActions();
    } else if (providerAnswer.provider === ProviderValue.execute)  {
        return await executeActions();
    } */
}