export class NotificationService {
    constructor() {
        this.createContainer();
    }
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 300px;
            max-width: 500px;
            animation: slideIn 0.3s ease-out;
            font-family: 'Stack Sans Text', sans-serif;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        `;
        const colors = {
            success: { bg: '#10b981', text: '#ffffff' },
            error: { bg: '#ef4444', text: '#ffffff' },
            warning: { bg: '#f59e0b', text: '#ffffff' },
            info: { bg: '#3b82f6', text: '#ffffff' }
        };
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        notification.style.backgroundColor = colors[type].bg;
        notification.style.color = colors[type].text;
        notification.innerHTML = `
            <span style="font-size: 20px; font-weight: bold;">${icons[type]}</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: transparent;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        `;
        this.container.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}
// Crear instancia global
export const notifications = new NotificationService();
//# sourceMappingURL=notifications.js.map