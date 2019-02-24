export class PlayerShortInfo {
    constructor(
        public aid: string,
        public name: string,
        public platform: string,
        public avatar: string,
        public legend: string,
        public level: number,
        public kills: number) { }
}

export class PlayerShortInfoResult {
    constructor(
        public results: PlayerShortInfo[],
        public totalresults: string) { }
}
