import DoctorForm from '../DoctorForm/DoctorForm';

function ProfileInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  return <div>{(user.role = 'doctor' && <DoctorForm />)}</div>;
}

export default ProfileInfo;
