// TODO: rename to remove word Model.
export class ConfigurationModel {
    constructor(
        public token: string,
        public prefix: string,
        public botName: string,
        public activity: string) { }
}
