import AuthLayout from '../components/AuthLayout';
import OtpForm from '../components/OtpForm';

const OtpScreen = ({ route }) => {
    const { phoneNumber } = route.params;

    return (
        <AuthLayout
            title="Verifiko numrin"
            subtitle={`Kodi u dërgua te ${phoneNumber}`}
            step={2}
        >
            <OtpForm />
        </AuthLayout>
    );
};

export default OtpScreen;
