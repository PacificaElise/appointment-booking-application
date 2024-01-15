import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { message, DatePicker } from 'antd';
import { getDoctorById } from '../../requests/doctors';
import moment from 'moment';

function BookAppointment() {
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState(null);

  const onChange = (date, dateString) => {
    setDate(date?.$d);
  };

  const { id } = useParams();

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctorById(id);
      if (res.success) {
        setDoctor(res.data);
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const getSlotsData = () => {
    const day = moment(date).format('dddd');
    if (!doctor.checkedList.includes(day)) {
      return (
        <h3 className='warn'>
          Doctor is not available on {moment(date).format('DD-MM-YYYY')}
        </h3>
      );
    }
    let startTime = moment(doctor.startTime, 'HH:mm');
    let endTime = moment(doctor.endTime, 'HH:mm');
    let slotDuration = 60; // im minutes
    let slots = [];
    while (startTime < endTime) {
      slots.push(startTime.format('HH:mm'));
      startTime.add(slotDuration, 'minutes');
    }
    return slots.map((slot) => {
      return (
        <div
          className='bg-white cursor-pointer slot p-1'
          key={slot}
        >
          <span>
            {moment(slot, 'HH:mm A').format('HH:mm A')} - {''}
            {moment(slot, 'HH:mm A')
              .add(slotDuration, 'minutes')
              .format('HH:mm A')}
          </span>
        </div>
      );
    });
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    doctor && (
      <section className='p-2'>
        <h1 className='name uppercase bold'>
          {doctor.firstName} {doctor.lastName}
        </h1>
        <hr className='my-1' />
        <div className='doctor-card'>
          <div className='flex flex-column gap-1'>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Speciality:</h5>
              <h4 className='uppercase'>{doctor.speciality}</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Experience:</h5>
              <h4>{doctor.experience} years</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Fee:</h5>
              <h4 className='uppercase'>{doctor.fee} $</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Email:</h5>
              <h4>{doctor.email}</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Phone:</h5>
              <h4>{doctor.phone}</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Available days:</h5>
              <h4 className='text-right'>{doctor.checkedList.join(', ')}</h4>
            </div>
          </div>
          <hr className='my-1' />
          <p className='my-1'>Select date:</p>
          <div className='flex flex-column'>
            <div className='flex gap-2 justify-between'>
              <DatePicker onChange={onChange} />
              <button className='contained-btn p-1'>Search</button>
            </div>
          </div>
        </div>
        <div className='flex gap-2 wrap my-2'>{date && getSlotsData()}</div>
      </section>
    )
  );
}

export default BookAppointment;
