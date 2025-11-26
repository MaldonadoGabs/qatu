export declare class NotificationService {
    private container;
    constructor();
    private createContainer;
    show(message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number): void;
    success(message: string, duration?: number): void;
    error(message: string, duration?: number): void;
    warning(message: string, duration?: number): void;
    info(message: string, duration?: number): void;
}
export declare const notifications: NotificationService;
//# sourceMappingURL=notifications.d.ts.map