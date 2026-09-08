import AuthLayout from '../components/AuthLayout';
import ProfileSetupForm from '../components/ProfileSetupForm';

const ProfileSetupScreen = () => {
    return (
        <AuthLayout
            title="Si quhesh?"
            subtitle="Kjo do të jetë emri yt te bisedat"
            step={3}
        >
            <ProfileSetupForm />
        </AuthLayout>
    );
};

export default ProfileSetupScreen;
