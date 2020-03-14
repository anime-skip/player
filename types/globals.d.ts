declare interface ServiceHelpers {
    getRootQuery(): string;
    getVideoQuery(): string;
    // VideoInjection: {
    //     addTime: (seconds: number) => void;
    //     togglePlayPause: () => void;
    //     nextTimestamp: () => void;
    //     previousTimestamp: () => void;
    //     setMuted: (isMuted: boolean) => void;
    // };
    getVideo(): HTMLVideoElement;
    onVideoChanged(callback: (video: HTMLVideoElement) => void): void;
}

declare global {
    namespace NodeJS {
        interface Global extends ServiceHelpers {
        }
    }
}
export default global;