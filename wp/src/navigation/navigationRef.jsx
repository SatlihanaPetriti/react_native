import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Boshatis stack-un dhe lë vetëm këtë ekran, ashtu që "mbrapa" të mos kthejë te login-i
export function resetTo(name) {
    if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name }] });
    }
}
