import DoctorForm from '../DoctorForm/DoctorForm';
import Admin from '../Admin/Admin';

function ProfileInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      {user.role === 'admin' && <Admin />}
      {user.role === 'doctor' && <DoctorForm />}
      {user.role === 'user' && <></>}
    </div>
  );
}

export default ProfileInfo;
