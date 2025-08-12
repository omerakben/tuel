declare const cn: (...classes: (string | undefined | null | false)[]) => string;
declare const isServer: boolean;
declare const isClient: boolean;

export { cn, isClient, isServer };
