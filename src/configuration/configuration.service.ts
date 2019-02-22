import * as path from 'path';
import * as YAML from 'yamljs';
import { ConfigurationModel } from './configuration-model';
import { Singleton } from 'typescript-ioc';

@Singleton
export class ConfigurationService {
    private readonly configurationFileName: string = '../settings.yml';

    private configurationModel: ConfigurationModel = {} as ConfigurationModel;

    public getBotConfiguration(): ConfigurationModel {
        if (!this.isModelValid()) {
            this.configurationModel = YAML.load(path.resolve(__dirname, this.configurationFileName)).settings;
        }

        return this.configurationModel;
    }

    private isModelValid(): boolean {
        return !!(this.configurationModel
            && this.configurationModel.activity
            && this.configurationModel.botName
            && this.configurationModel.prefix
            && this.configurationModel.token);
    }
}
