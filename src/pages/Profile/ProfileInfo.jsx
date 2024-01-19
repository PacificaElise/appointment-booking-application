import DoctorForm from '../DoctorForm/DoctorForm';
import Admin from '../Admin/Admin';
import moment from 'moment/moment';

function ProfileInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      {user.role === 'admin' && <Admin />}
      {user.role === 'doctor' && <DoctorForm />}
      {user.role === 'user' && (
        <>
          <div className='p-1 my-1 flex flex-column gap-1'>
            <h3 className='bold'>Name: {user.name}</h3>
          </div>
          <div className='p-1 my-1 flex flex-column gap-1'>
            <h3 className='bold'>Email: {user.email}</h3>
          </div>
          <div className='p-1 my-1 flex flex-column gap-1'>
            <h3 className='bold'>
              Created On: {moment(user?.createdAt).format('DD-MM-YYY hh:mm A')}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileInfo;
