import AuthLayout from '../components/AuthLayout';
import PhoneForm from '../components/PhoneForm';

const PhoneScreen = () => {
    return (
        <AuthLayout
            title="Hyr në llogari"
            subtitle="Fut numrin e telefonit, do të të dërgojmë një kod verifikimi"
            step={1}
        >
            <PhoneForm />
        </AuthLayout>
    );
};

export default PhoneScreen;
