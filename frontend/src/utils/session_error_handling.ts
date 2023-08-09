import { useNavigate  } from 'react-router-dom';

export const useApiSessionHandling = (error: any) => {
    const errCode = error.response.data.error_code;
    const navigate = useNavigate();

    if (errCode === 'MISSING_TOKEN' || 'EXPIRED_TOKEN' || 'INVALID_TOKEN') {
        alert('your session has been expired, please re-log in!');
        navigate('/sign-in');
    }
}
