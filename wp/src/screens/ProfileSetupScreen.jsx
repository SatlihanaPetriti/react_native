import AuthLayout from '../components/AuthLayout';
import ProfileSetupForm from '../components/ProfileSetupForm';

const ProfileSetupScreen = () => {
    return (
        <AuthLayout
            title="Plotëso profilin"
            subtitle="Këto të dhëna shfaqen te bisedat e tua"
            step={3}
        >
            <ProfileSetupForm />
        </AuthLayout>
    );
};

export default ProfileSetupScreen;
